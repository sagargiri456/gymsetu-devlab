import time
import logging
from functools import wraps
from flask import request, jsonify, g
from utils.validation import validate_json_request, ValidationError

# Configure logging
logger = logging.getLogger(__name__)


def request_logging_middleware(app):
    """Middleware for logging requests"""

    @app.before_request
    def log_request_info():
        g.start_time = time.time()
        auth_header = request.headers.get("Authorization")
        auth_status = "Present" if auth_header else "Missing"
        # Log first 20 chars of auth header to help debug format issues (without exposing full token)
        auth_preview = (
            (
                auth_header[:20] + "..."
                if auth_header and len(auth_header) > 20
                else auth_header
            )
            if auth_header
            else "None"
        )
        logger.info(
            f"Request: {request.method} {request.path} from {request.remote_addr} "
            f"[Authorization: {auth_status}, Preview: {auth_preview}]"
        )

        # Only attempt to parse JSON for methods that typically have request bodies
        # and when Content-Length > 0 (meaning there's actually content)
        if request.method in ["POST", "PUT", "PATCH", "DELETE"] and request.is_json:
            try:
                request_data = request.get_json(silent=True)
                if request_data:
                    logger.info(f"Request data: {request_data}")
            except Exception as e:
                logger.warning(f"Failed to parse JSON data: {str(e)}")

    @app.after_request
    def log_response_info(response):
        if hasattr(g, "start_time"):
            duration = time.time() - g.start_time
            logger.info(f"Response: {response.status_code} in {duration:.3f}s")
        return response


def validate_request_data(validation_func=None):
    """Decorator to validate request data"""

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # Check if request is JSON
                if not request.is_json:
                    return (
                        jsonify(
                            {
                                "error": "Invalid Request",
                                "message": "Request must be JSON",
                            }
                        ),
                        400,
                    )

                data = request.get_json()
                if data is None:
                    return (
                        jsonify(
                            {
                                "error": "Invalid Request",
                                "message": "Request body cannot be empty",
                            }
                        ),
                        400,
                    )

                # Run validation if provided
                if validation_func:
                    validation_func(data)

                return f(*args, **kwargs)

            except Exception as e:
                logger.error(f"Request validation error: {str(e)}")
                return jsonify({"error": "Validation Error", "message": str(e)}), 400

        return wrapper

    return decorator


def handle_database_errors(f):
    """Decorator to handle database errors - allows ValidationErrors to propagate"""

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValidationError as ve:
            # Let ValidationError propagate to the error handler (returns 400)
            raise
        except Exception as e:
            logger.error(f"Database error in {f.__name__}: {str(e)}")

            # Ensure session is rolled back if there's a database error
            try:
                from database import db

                db.session.rollback()
            except:
                pass  # Ignore rollback errors if session is already rolled back

            # Check for specific database errors
            error_msg = str(e).lower()
            if "unique constraint" in error_msg or "duplicate" in error_msg:
                return (
                    jsonify(
                        {"error": "Database Error", "message": "Record already exists"}
                    ),
                    409,
                )
            elif "foreign key" in error_msg:
                return (
                    jsonify(
                        {
                            "error": "Database Error",
                            "message": "Referenced record not found",
                        }
                    ),
                    400,
                )
            elif "not null" in error_msg:
                return (
                    jsonify(
                        {
                            "error": "Database Error",
                            "message": "Required field is missing",
                        }
                    ),
                    400,
                )
            elif (
                "too long for type character varying" in error_msg
                or "stringdatarighttruncation" in error_msg
            ):
                return (
                    jsonify(
                        {
                            "error": "Database Schema Error",
                            "message": "Database column length is too small. Please update schema.",
                        }
                    ),
                    500,
                )
            else:
                return (
                    jsonify(
                        {
                            "error": "Database Error",
                            "message": "Database operation failed",
                        }
                    ),
                    500,
                )

    return wrapper


def rate_limit_middleware(max_requests=100, window=60):
    """Simple rate limiting middleware"""
    from collections import defaultdict, deque

    requests = defaultdict(deque)

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()

            # Clean old requests
            while (
                requests[client_ip] and requests[client_ip][0] <= current_time - window
            ):
                requests[client_ip].popleft()

            # Check rate limit
            if len(requests[client_ip]) >= max_requests:
                return (
                    jsonify(
                        {
                            "error": "Rate Limit Exceeded",
                            "message": f"Too many requests. Limit: {max_requests} per {window} seconds",
                        }
                    ),
                    429,
                )

            # Add current request
            requests[client_ip].append(current_time)

            return f(*args, **kwargs)

        return wrapper

    return decorator


def cors_middleware(app):
    """Enhanced CORS middleware"""

    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response


def security_headers_middleware(app):
    """Add security headers to responses"""

    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers[
            "Strict-Transport-Security"
        ] = "max-age=31536000; includeSubDomains"
        return response
