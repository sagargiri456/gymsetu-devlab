from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from database import db
from utils.error_handlers import register_error_handlers
from utils.middleware import (
    request_logging_middleware,
    security_headers_middleware,
)
import os

jwt = JWTManager()
cors = CORS()


def create_app():
    app = Flask(__name__)
    # from_object() looks for uppercase attributes in the
    # given object and loads them into app.config. So lowercase variables are ignored.
    app.config.from_object(Config)

    # Ensure JWT_SECRET_KEY is set
    if not app.config.get("JWT_SECRET_KEY"):
        app.config["JWT_SECRET_KEY"] = os.getenv(
            "JWT_SECRET_KEY", "fallback-secret-key-change-in-production"
        )

    # Log for debugging
    import logging

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    logger.info(f"JWT_SECRET_KEY set: {bool(app.config.get('JWT_SECRET_KEY'))}")

    # Log database connection info (without exposing sensitive data)
    db_url = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if db_url:
        # Mask password in logs
        parsed_db_url = db_url.split("@")[-1] if "@" in db_url else "Not configured"
        logger.info(f"Database configured: {parsed_db_url}")
    else:
        logger.error("DATABASE_URL is not set!")

    # init_app() is used to initialize the extensions with the app. just like middleware in express.
    # CORS configuration - supports local development and production deployments
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    allowed_origins = [
        origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()
    ]

    # Always allow localhost and 127.0.0.1 for local development
    if "http://localhost:3000" not in allowed_origins:
        allowed_origins.append("http://localhost:3000")
    if "http://127.0.0.1:3000" not in allowed_origins:
        allowed_origins.append("http://127.0.0.1:3000")

    # Add frontend URL to allowed origins if in production
    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url:
        frontend_url_clean = frontend_url.rstrip("/")
        if frontend_url_clean not in allowed_origins:
            allowed_origins.append(frontend_url_clean)

    # Remove duplicates and filter empty strings
    allowed_origins = list(set(filter(None, allowed_origins)))

    logger.info(f"CORS allowed origins: {allowed_origins}")

    # Configure CORS with comprehensive settings
    cors.init_app(
        app,
        origins=allowed_origins,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        expose_headers=["Content-Type"],
        max_age=3600,  # Cache preflight requests for 1 hour
        automatic_options=True,  # Automatically handle OPTIONS requests
    )

    # Initialize database with engine options
    db.init_app(app)

    # Apply SQLAlchemy engine options for production
    if hasattr(Config, "SQLALCHEMY_ENGINE_OPTIONS"):
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = Config.SQLALCHEMY_ENGINE_OPTIONS

    jwt.init_app(app)

    # Register JWT error callbacks for detailed logging
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        logger.warning(
            f"Expired token on {request.method} {request.path} from {request.remote_addr}"
        )
        return jsonify({"msg": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        auth_header = request.headers.get("Authorization", "Not provided")
        logger.warning(
            f"Invalid token on {request.method} {request.path}: {str(error)}. "
            f"Authorization header: {'Present' if auth_header != 'Not provided' else 'Missing'}"
        )
        return jsonify({"msg": f"Invalid token: {str(error)}"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        auth_header = request.headers.get("Authorization", "Not provided")
        logger.warning(
            f"Missing token on {request.method} {request.path}: {str(error)}. "
            f"Authorization header: {'Present' if auth_header != 'Not provided' else 'Missing'}"
        )
        return jsonify({"msg": f"Authorization required: {str(error)}"}), 401

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        # Return True if token is in blocklist (revoked), False otherwise
        # For now, we don't have a token blocklist, so always return False
        return False

    # Register error handlers
    register_error_handlers(app)

    # Register middleware
    request_logging_middleware(app)
    security_headers_middleware(app)

    # register_blueprint() is used to register the blueprints with the app. just like routes in express.
    from routes.auth_route import auth_bp
    from routes.gyms_route import gyms_bp
    from routes.members_route import members_bp
    from routes.subscription_plan_route import subscription_plan_route
    from routes.subscription_route import subscription_bp
    from routes.trainers_route import trainers_bp
    from routes.contest_route import contest_bp
    from routes.participants_route import participants_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(gyms_bp)
    app.register_blueprint(members_bp)
    app.register_blueprint(subscription_plan_route)
    app.register_blueprint(subscription_bp)
    app.register_blueprint(trainers_bp)
    app.register_blueprint(contest_bp)
    app.register_blueprint(participants_bp)

    # Import models and create tables after everything is registered
    with app.app_context():
        try:
            from models.gym import Gym
            from models.members import Member
            from models.subscription import Subscription
            from models.subscription_plan import SubscriptionPlan
            from models.trainers import Trainer
            from models.contest import Contest
            from models.participants import Participant

            # Test database connection
            logger.info("Attempting to connect to database...")
            db.create_all()
            logger.info("Database tables created/verified successfully")
        except Exception as e:
            logger.error(f"Database initialization error: {str(e)}")
            # Don't fail silently - raise the error so deployment fails if DB is misconfigured
            raise

    return app


# Create app instance for gunicorn/production servers
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
