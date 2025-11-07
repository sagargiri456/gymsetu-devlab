from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.gym import Gym
from sqlalchemy.exc import SQLAlchemyError
from utils.validation import ValidationError
import logging

logger = logging.getLogger(__name__)


def owner_required(f):
    """
    Decorator to require owner role for accessing a route
    """

    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            # Get the current user ID from JWT token
            current_user_id = get_jwt_identity()
            logger.info(
                f"JWT identity extracted: {current_user_id} (type: {type(current_user_id)})"
            )

            if not current_user_id:
                logger.warning("JWT identity is None or empty")
                return jsonify({"message": "Invalid token: missing identity"}), 401

            # Convert to int if it's a string
            if isinstance(current_user_id, str):
                current_user_id = int(current_user_id)
                logger.info(f"Converted user_id to int: {current_user_id}")

            # Get the gym/user from database
            gym = Gym.query.get(current_user_id)
            logger.info(
                f"Gym lookup for ID {current_user_id}: {'Found' if gym else 'Not found'}"
            )

            if not gym:
                logger.warning(f"Gym not found for ID: {current_user_id}")
                return jsonify({"message": "User not found"}), 404

            # Check if user has owner role
            if not gym.is_owner():
                logger.warning(
                    f"Gym {current_user_id} does not have owner role (current role: {gym.role})"
                )
                return jsonify({"message": "Access denied. Owner role required"}), 403

            logger.info(f"Authentication successful for gym {current_user_id}")
            # Add the gym object to kwargs so the route can access it
            kwargs["current_gym"] = gym
            return f(*args, **kwargs)
        except ValidationError:
            # Let ValidationError propagate to be handled by error handlers (returns 400)
            raise
        except (ValueError, TypeError) as e:
            logger.error(
                f"Token validation error (ValueError/TypeError): {str(e)}",
                exc_info=True,
            )
            return jsonify({"message": f"Invalid token: {str(e)}"}), 401
        except SQLAlchemyError:
            # Let database errors propagate to be handled by handle_database_errors decorator
            # or the error handlers
            raise
        except Exception as e:
            logger.error(f"Token validation error (Exception): {str(e)}", exc_info=True)
            return jsonify({"message": f"Token validation error: {str(e)}"}), 401

    return decorated_function


def role_required(required_role):
    """
    Decorator to require a specific role for accessing a route

    Args:
        required_role (str): The role required to access the route
    """

    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            try:
                # Get the current user ID from JWT token
                current_user_id = get_jwt_identity()

                if not current_user_id:
                    return jsonify({"message": "Invalid token: missing identity"}), 401

                # Convert to int if it's a string
                if isinstance(current_user_id, str):
                    current_user_id = int(current_user_id)

                # Get the gym/user from database
                gym = Gym.query.get(current_user_id)

                if not gym:
                    return jsonify({"message": "User not found"}), 404

                # Check if user has the required role
                if not gym.has_role(required_role):
                    return (
                        jsonify(
                            {"message": f"Access denied. {required_role} role required"}
                        ),
                        403,
                    )

                # Add the gym object to kwargs so the route can access it
                kwargs["current_gym"] = gym
                return f(*args, **kwargs)
            except (ValueError, TypeError) as e:
                return jsonify({"message": f"Invalid token: {str(e)}"}), 401
            except Exception as e:
                return jsonify({"message": f"Token validation error: {str(e)}"}), 401

        return decorated_function

    return decorator


def get_current_gym():
    """
    Helper function to get the current gym from JWT token
    """
    current_user_id = get_jwt_identity()
    return Gym.query.get(int(current_user_id))


def member_required(f):
    """
    Decorator to require member authentication for accessing a route
    Returns member_id and gym_id from token
    """

    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            from models.members import Member

            # Get the current user identity from JWT token
            current_user_identity = get_jwt_identity()
            logger.info(f"Member identity extracted: {current_user_identity}")

            if not current_user_identity:
                logger.warning("JWT identity is None or empty")
                return jsonify({"message": "Invalid token: missing identity"}), 401

            # Parse token format: "member:member_id:gym_id"
            if not isinstance(
                current_user_identity, str
            ) or not current_user_identity.startswith("member:"):
                logger.warning(f"Invalid member token format: {current_user_identity}")
                return jsonify({"message": "Invalid token: member token required"}), 401

            # Extract member_id and gym_id
            parts = current_user_identity.split(":")
            if len(parts) != 3:
                logger.warning(f"Invalid member token format: {current_user_identity}")
                return jsonify({"message": "Invalid token format"}), 401

            member_id = int(parts[1])
            gym_id = int(parts[2])

            # Get the member from database
            member = Member.query.filter_by(id=member_id, gym_id=gym_id).first()

            if not member:
                logger.warning(
                    f"Member not found: member_id={member_id}, gym_id={gym_id}"
                )
                return jsonify({"message": "Member not found"}), 404

            if not member.is_active:
                logger.warning(f"Member account is inactive: member_id={member_id}")
                return jsonify({"message": "Member account is inactive"}), 403

            logger.info(
                f"Member authentication successful: member_id={member_id}, gym_id={gym_id}"
            )
            # Add member_id and gym_id to kwargs
            kwargs["member_id"] = member_id
            kwargs["gym_id"] = gym_id
            kwargs["member"] = member
            return f(*args, **kwargs)
        except (ValueError, TypeError) as e:
            logger.error(f"Token validation error: {str(e)}", exc_info=True)
            return jsonify({"message": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}", exc_info=True)
            return jsonify({"message": f"Token validation error: {str(e)}"}), 401

    return decorated_function
