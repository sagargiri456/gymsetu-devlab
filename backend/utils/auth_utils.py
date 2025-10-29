from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.gym import Gym


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

            if not current_user_id:
                return jsonify({"message": "Invalid token: missing identity"}), 401

            # Convert to int if it's a string
            if isinstance(current_user_id, str):
                current_user_id = int(current_user_id)

            # Get the gym/user from database
            gym = Gym.query.get(current_user_id)

            if not gym:
                return jsonify({"message": "User not found"}), 404

            # Check if user has owner role
            if not gym.is_owner():
                return jsonify({"message": "Access denied. Owner role required"}), 403

            # Add the gym object to kwargs so the route can access it
            kwargs["current_gym"] = gym
            return f(*args, **kwargs)
        except (ValueError, TypeError) as e:
            return jsonify({"message": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
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
