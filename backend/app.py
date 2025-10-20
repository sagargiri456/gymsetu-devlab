from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from utils.error_handlers import register_error_handlers
from utils.middleware import (
    request_logging_middleware,
    cors_middleware,
    security_headers_middleware,
)

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()


def create_app():
    app = Flask(__name__)
    # from_object() looks for uppercase attributes in the
    # given object and loads them into app.config. So lowercase variables are ignored.
    app.config.from_object(Config)

    # init_app() is used to initialize the extensions with the app. just like middleware in express.
    cors.init_app(app)
    db.init_app(app)
    jwt.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register middleware
    request_logging_middleware(app)
    cors_middleware(app)
    security_headers_middleware(app)

    # register_blueprint() is used to register the blueprints with the app. just like routes in express.
    from routes.auth_route import auth_bp
    from routes.members_route import members_bp
    from routes.subscription_plan_route import subscription_plan_route
    from routes.subscription_route import subscription_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(members_bp)
    app.register_blueprint(subscription_plan_route)
    app.register_blueprint(subscription_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
