from flask import jsonify, request
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import os
from utils.validation import ValidationError
from utils.validation import ValidationError
from flask_jwt_extended.exceptions import JWTExtendedException
from jwt.exceptions import DecodeError, InvalidTokenError
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def handle_validation_error(error):
    """Handle validation errors"""
    logger.warning(f"Validation error: {error.message}")
    return (
        jsonify(
            {
                "error": "Validation Error",
                "message": error.message,
                "field": error.field,
            }
        ),
        400,
    )


def register_error_handlers(app):
    """Register all error handlers with the Flask app"""

    @app.errorhandler(ValidationError)
    def handle_validation_error_handler(error):
        """Handle validation errors"""
        return handle_validation_error(error)

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        """Handle database integrity errors (SQLite/PostgreSQL)."""
        logger.error(f"Database integrity error: {str(error)}")

        expose_details = os.getenv("EXPOSE_ERRORS", "false").lower() == "true"

        # Prefer database-agnostic detection using SQLSTATE when available (psycopg2)
        pgcode = getattr(getattr(error, "orig", None), "pgcode", None)
        if pgcode == "23505":  # unique_violation
            # Try to provide a friendlier message
            return (
                jsonify(
                    {
                        "error": "Database Error",
                        "message": "Duplicate entry found (unique constraint)",
                    }
                ),
                409,
            )
        if pgcode == "23503":  # foreign_key_violation
            return (
                jsonify(
                    {
                        "error": "Database Error",
                        "message": "Referenced record not found (foreign key)",
                    }
                ),
                400,
            )

        # Fallback to string matching for SQLite or generic engines
        error_msg = str(getattr(error, "orig", error))
        if (
            "UNIQUE constraint failed" in error_msg
            or "duplicate key value violates unique constraint" in error_msg
        ):
            return (
                jsonify(
                    {
                        "error": "Database Error",
                        "message": "Duplicate entry found (unique constraint)",
                    }
                ),
                409,
            )
        if "FOREIGN KEY constraint" in error_msg:
            return (
                jsonify(
                    {
                        "error": "Database Error",
                        "message": "Referenced record not found (foreign key)",
                    }
                ),
                400,
            )

        # Optionally expose original details when debugging
        if expose_details:
            return (
                jsonify(
                    {
                        "error": "Database Error",
                        "message": "Data integrity violation",
                        "details": error_msg,
                    }
                ),
                400,
            )

        return (
            jsonify({"error": "Database Error", "message": "Data integrity violation"}),
            400,
        )

    @app.errorhandler(SQLAlchemyError)
    def handle_sqlalchemy_error(error):
        """Handle SQLAlchemy errors."""
        logger.error(f"SQLAlchemy error: {str(error)}")
        expose_details = os.getenv("EXPOSE_ERRORS", "false").lower() == "true"
        payload = {"error": "Database Error", "message": "Database operation failed"}
        if expose_details:
            payload["details"] = str(error)
        return jsonify(payload), 500

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        """Handle value errors"""
        logger.warning(f"Value error: {str(error)}")
        return jsonify({"error": "Invalid Value", "message": str(error)}), 400

    @app.errorhandler(TypeError)
    def handle_type_error(error):
        """Handle type errors"""
        logger.warning(f"Type error: {str(error)}")
        return (
            jsonify({"error": "Invalid Type", "message": "Invalid data type provided"}),
            400,
        )

    @app.errorhandler(KeyError)
    def handle_key_error(error):
        """Handle key errors"""
        logger.warning(f"Key error: {str(error)}")
        return (
            jsonify(
                {
                    "error": "Missing Key",
                    "message": f"Required field missing: {str(error)}",
                }
            ),
            400,
        )

    @app.errorhandler(AttributeError)
    def handle_attribute_error(error):
        """Handle attribute errors"""
        logger.warning(f"Attribute error: {str(error)}")
        return (
            jsonify(
                {"error": "Attribute Error", "message": "Invalid attribute access"}
            ),
            500,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """Handle HTTP exceptions"""
        logger.warning(f"HTTP error {error.code}: {error.description}")
        return (
            jsonify(
                {
                    "error": "HTTP Error",
                    "message": error.description,
                    "code": error.code,
                }
            ),
            error.code,
        )

    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 errors"""
        return (
            jsonify(
                {
                    "error": "Not Found",
                    "message": "The requested resource was not found",
                    "path": request.path,
                }
            ),
            404,
        )

    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        """Handle 405 errors"""
        return (
            jsonify(
                {
                    "error": "Method Not Allowed",
                    "message": "The requested method is not allowed for this endpoint",
                    "path": request.path,
                }
            ),
            405,
        )

    @app.errorhandler(500)
    def handle_internal_server_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal server error: {str(error)}")
        return (
            jsonify(
                {
                    "error": "Internal Server Error",
                    "message": "An unexpected error occurred",
                }
            ),
            500,
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Handle all other exceptions"""
        logger.error(f"Unexpected error: {str(error)}")
        return (
            jsonify(
                {
                    "error": "Internal Server Error",
                    "message": "An unexpected error occurred",
                }
            ),
            500,
        )

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_extended_error(error):
        """Handle JWT Extended errors"""
        logger.warning(f"JWT error: {str(error)}")
        return jsonify({"msg": str(error)}), 401

    @app.errorhandler(DecodeError)
    def handle_decode_error(error):
        """Handle JWT decode errors"""
        logger.warning(f"JWT decode error: {str(error)}")
        return jsonify({"msg": str(error)}), 401

    @app.errorhandler(InvalidTokenError)
    def handle_invalid_token_error(error):
        """Handle invalid token errors"""
        logger.warning(f"Invalid token error: {str(error)}")
        return jsonify({"msg": str(error)}), 401


def create_error_response(message, status_code=400, error_type="Error"):
    """Helper function to create standardized error responses"""
    return jsonify({"error": error_type, "message": message}), status_code


def handle_validation_errors(validation_func):
    """Decorator to handle validation errors"""

    def decorator(f):
        def wrapper(*args, **kwargs):
            try:
                if hasattr(validation_func, "__call__"):
                    validation_func(request.get_json())
                return f(*args, **kwargs)
            except ValidationError as e:
                return handle_validation_error(e)

        return wrapper

    return decorator
