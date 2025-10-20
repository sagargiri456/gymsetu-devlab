from flask import Blueprint, request, jsonify
from app import db
from models.gym import Gym
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.email_utils import send_password_reset_email
from utils.auth_utils import owner_required, get_current_gym
from utils.validation import (
    validate_gym_registration,
    validate_login_data,
    validate_password_reset_data,
    validate_change_password_data,
    validate_json_request,
)
from utils.middleware import handle_database_errors


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
@validate_json_request
@handle_database_errors
def register():
    data = request.get_json()

    # Validate registration data
    validate_gym_registration(data)

    # Check if email already exists
    existing_gym = Gym.query.filter_by(email=data["email"]).first()
    if existing_gym:
        return jsonify({"error": "Email already exists"}), 409

    gym = Gym(
        name=data["name"],
        address=data["address"],
        city=data["city"],
        state=data["state"],
        zip=data["zip"],
        phone=data["phone"],
        email=data["email"],
        password=data["password"],
    )
    gym.set_password(data["password"])
    db.session.add(gym)
    db.session.commit()
    return jsonify({"success": True, "message": "Gym registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
@validate_json_request
def login():
    data = request.get_json()

    # Validate login data
    validate_login_data(data)

    gym = Gym.query.filter_by(email=data["email"]).first()
    if gym and gym.check_password(data["password"]):
        access_token = create_access_token(
            identity=gym.id
        )  # used to create a JWT token for the user session.
        return (
            jsonify(
                {
                    "message": "Logged in successfully",
                    "access_token": access_token,
                    "user": {
                        "id": gym.id,
                        "name": gym.name,
                        "email": gym.email,
                        "role": gym.role,
                    },
                }
            ),
            200,
        )
    return jsonify({"message": "Invalid credentials"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    data = request.get_json()
    token = data["token"]
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    data = request.get_json()
    token = data["token"]
    return jsonify({"message": "Token refreshed successfully"}), 200


@auth_bp.route("/forgot_password", methods=["POST"])
@validate_json_request
@handle_database_errors
def forgot_password():
    data = request.get_json()

    # Validate email format
    from utils.validation import validate_email

    if not validate_email(data["email"]):
        return jsonify({"error": "Invalid email format"}), 400

    email = data["email"]
    gym = Gym.query.filter_by(email=email).first()
    if gym:
        # Generate a simple OTP (6-digit number)
        import random

        otp = str(random.randint(100000, 999999))

        # Store OTP in the gym record
        gym.otp = otp
        db.session.commit()

        # Send email with OTP
        if send_password_reset_email(email, otp):
            return (
                jsonify({"message": "Password reset OTP email sent successfully"}),
                200,
            )
        else:
            return jsonify({"message": "Failed to send email"}), 500
    else:
        return jsonify({"message": "Email not found"}), 404


@auth_bp.route("/reset_password", methods=["POST"])
@validate_json_request
@handle_database_errors
def reset_password():
    data = request.get_json()

    # Validate password reset data
    validate_password_reset_data(data)

    email = data["email"]
    otp = data["otp"]
    password = data["password"]
    gym = Gym.query.filter_by(email=email).first()
    if gym and gym.otp == otp:
        gym.set_password(password)
        gym.otp = None
        db.session.commit()
        return jsonify({"message": "Password reset successfully"}), 200
    return jsonify({"message": "Invalid OTP"}), 401


@auth_bp.route("/change_password", methods=["POST"])
@validate_json_request
@handle_database_errors
def change_password():
    data = request.get_json()

    # Validate change password data
    validate_change_password_data(data)

    email = data["email"]
    old_password = data["old_password"]
    new_password = data["new_password"]
    gym = Gym.query.filter_by(email=email).first()
    if gym and gym.check_password(old_password):
        gym.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    return jsonify({"message": "Invalid old password"}), 401


@auth_bp.route("/get_gym_profile", methods=["GET"])
def get_gym_profile():
    data = request.get_json()
    email = data["email"]
    gym = Gym.query.filter_by(email=email).first()
    return (
        jsonify({"message": "gym profile fetched successfully", "gym": gym.to_dict()}),
        200 if gym else jsonify({"message": "gym not found"}),
        404,
    )


@auth_bp.route("/update_gym_profile", methods=["PUT"])
def update_gym_profile():
    data = request.get_json()
    email = data["email"]
    name = data["name"]
    address = data["address"]
    city = data["city"]
    state = data["state"]
    zip = data["zip"]
    phone = data["phone"]
    gym = Gym.query.filter_by(email=email).first()
    if gym:
        gym.name = name
        gym.address = address
        gym.city = city
        gym.state = state
        gym.zip = zip
        gym.phone = phone
        db.session.commit()
        return jsonify({"message": "gym profile updated successfully"}), 200
    return jsonify({"message": "gym not found"}), 404


@auth_bp.route("/delete_gym_profile", methods=["DELETE"])
def delete_gym_profile():
    data = request.get_json()
    email = data["email"]
    gym = Gym.query.filter_by(email=email).first()
    if gym:
        db.session.delete(gym)
        db.session.commit()
        return jsonify({"message": "gym profile deleted successfully"}), 200
    return jsonify({"message": "gym not found"}), 404


@auth_bp.route("/get_gym_by_id", methods=["GET"])
def get_gym_by_id():
    data = request.get_json()
    id = data["id"]
    gym = Gym.query.filter_by(id=id).first()
    return (
        jsonify({"message": "gym fetched successfully", "gym": gym.to_dict()}),
        200 if gym else jsonify({"message": "gym not found"}),
        404,
    )


@auth_bp.route("/get_all_gyms", methods=["GET"])
def get_all_gyms():
    gyms = Gym.query.all()
    return (
        jsonify(
            {
                "message": "All gyms fetched successfully",
                "gyms": [gym.to_dict() for gym in gyms],
            }
        ),
        200,
    )
