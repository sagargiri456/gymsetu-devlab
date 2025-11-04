from flask import Blueprint, request, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
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
    from models.gym import Gym

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
    from database import db

    db.session.add(gym)
    db.session.commit()
    return jsonify({"success": True, "message": "Gym registered successfully"}), 201


@auth_bp.route("/get_gyms", methods=["GET"])
def get_gyms():
    """Get list of all gyms for dropdown selection (public endpoint)"""
    from models.gym import Gym

    gyms = Gym.query.all()
    gyms_list = [
        {
            "id": gym.id,
            "name": gym.name,
            "email": gym.email,
            "city": gym.city,
            "state": gym.state,
        }
        for gym in gyms
    ]
    return jsonify({"success": True, "gyms": gyms_list}), 200


@auth_bp.route("/trainer/check", methods=["POST"])
@validate_json_request
@handle_database_errors
def trainer_check():
    """Step 1: Check if trainer exists and if password is set"""
    from models.trainers import Trainer
    from models.gym import Gym

    data = request.get_json()

    # Validate required fields
    if not data.get("gym_id"):
        return jsonify({"error": "Gym ID is required"}), 400
    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400

    gym_id = data["gym_id"]
    email = data["email"]

    # Verify gym exists
    gym = Gym.query.get(gym_id)
    if not gym:
        return jsonify({"error": "Gym not found"}), 404

    # Find trainer in this gym
    trainer = Trainer.query.filter_by(email=email, gym_id=gym_id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found in this gym"}), 404

    if not trainer.is_active:
        return jsonify({"error": "Trainer account is inactive"}), 403

    # Check if password exists
    if trainer.password:
        # Password exists - user needs to enter password
        return (
            jsonify(
                {
                    "requires_password": True,
                    "message": "Enter your password",
                    "trainer_id": trainer.id,
                    "gym_id": gym_id,
                }
            ),
            200,
        )
    else:
        # No password - user needs to setup password
        return (
            jsonify(
                {
                    "requires_password": False,
                    "first_time": True,
                    "message": "Setup your password",
                    "trainer_id": trainer.id,
                    "gym_id": gym_id,
                }
            ),
            200,
        )


@auth_bp.route("/trainer/login", methods=["POST"])
@validate_json_request
@handle_database_errors
def trainer_login():
    """Step 2: Verify password (if exists) or setup password (if first time) and login"""
    from models.trainers import Trainer
    from models.gym import Gym
    from database import db
    import logging

    logger = logging.getLogger(__name__)
    data = request.get_json()

    # Validate required fields
    if not data.get("gym_id"):
        return jsonify({"error": "Gym ID is required"}), 400
    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400
    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400

    gym_id = data["gym_id"]
    email = data["email"]
    password = data["password"]

    # Verify gym exists
    gym = Gym.query.get(gym_id)
    if not gym:
        return jsonify({"error": "Gym not found"}), 404

    # Find trainer in this gym
    trainer = Trainer.query.filter_by(email=email, gym_id=gym_id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found in this gym"}), 404

    if not trainer.is_active:
        return jsonify({"error": "Trainer account is inactive"}), 403

    # Check if password exists
    if trainer.password:
        # Password exists - verify it
        if not trainer.check_password(password):
            return jsonify({"error": "Invalid password"}), 401
    else:
        # No password - setup password for first time
        trainer.set_password(password)
        db.session.commit()
        logger.info(f"Password set for trainer {trainer.id}")

    # Generate JWT token with trainer info
    # Token format: "trainer:trainer_id:gym_id"
    token_identity = f"trainer:{trainer.id}:{gym_id}"
    access_token = create_access_token(identity=token_identity)

    logger.info(f"Trainer {trainer.id} logged in successfully")
    return (
        jsonify(
            {
                "message": "Logged in successfully",
                "access_token": access_token,
                "user": {
                    "id": trainer.id,
                    "name": trainer.name,
                    "email": trainer.email,
                    "role": "trainer",
                    "gym_id": gym_id,
                },
            }
        ),
        200,
    )


@auth_bp.route("/member/check", methods=["POST"])
@validate_json_request
@handle_database_errors
def member_check():
    """Step 1: Check if member exists and if password is set"""
    from models.members import Member
    from models.gym import Gym

    data = request.get_json()

    # Validate required fields
    if not data.get("gym_id"):
        return jsonify({"error": "Gym ID is required"}), 400
    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400

    gym_id = data["gym_id"]
    email = data["email"]

    # Verify gym exists
    gym = Gym.query.get(gym_id)
    if not gym:
        return jsonify({"error": "Gym not found"}), 404

    # Find member in this gym
    member = Member.query.filter_by(email=email, gym_id=gym_id).first()
    if not member:
        return jsonify({"error": "Member not found in this gym"}), 404

    if not member.is_active:
        return jsonify({"error": "Member account is inactive"}), 403

    # Check if password exists
    if member.password:
        # Password exists - user needs to enter password
        return (
            jsonify(
                {
                    "requires_password": True,
                    "message": "Enter your password",
                    "member_id": member.id,
                    "gym_id": gym_id,
                }
            ),
            200,
        )
    else:
        # No password - user needs to setup password
        return (
            jsonify(
                {
                    "requires_password": False,
                    "first_time": True,
                    "message": "Setup your password",
                    "member_id": member.id,
                    "gym_id": gym_id,
                }
            ),
            200,
        )


@auth_bp.route("/member/login", methods=["POST"])
@validate_json_request
@handle_database_errors
def member_login():
    """Step 2: Verify password (if exists) or setup password (if first time) and login"""
    from models.members import Member
    from models.gym import Gym
    from database import db
    import logging

    logger = logging.getLogger(__name__)
    data = request.get_json()

    # Validate required fields
    if not data.get("gym_id"):
        return jsonify({"error": "Gym ID is required"}), 400
    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400
    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400

    gym_id = data["gym_id"]
    email = data["email"]
    password = data["password"]

    # Verify gym exists
    gym = Gym.query.get(gym_id)
    if not gym:
        return jsonify({"error": "Gym not found"}), 404

    # Find member in this gym
    member = Member.query.filter_by(email=email, gym_id=gym_id).first()
    if not member:
        return jsonify({"error": "Member not found in this gym"}), 404

    if not member.is_active:
        return jsonify({"error": "Member account is inactive"}), 403

    # Check if password exists
    if member.password:
        # Password exists - verify it
        if not member.check_password(password):
            return jsonify({"error": "Invalid password"}), 401
    else:
        # No password - setup password for first time
        member.set_password(password)
        db.session.commit()
        logger.info(f"Password set for member {member.id}")

    # Generate JWT token with member info
    # Token format: "member:member_id:gym_id"
    token_identity = f"member:{member.id}:{gym_id}"
    access_token = create_access_token(identity=token_identity)

    logger.info(f"Member {member.id} logged in successfully")
    return (
        jsonify(
            {
                "message": "Logged in successfully",
                "access_token": access_token,
                "user": {
                    "id": member.id,
                    "name": member.name,
                    "email": member.email,
                    "role": "member",
                    "gym_id": gym_id,
                },
            }
        ),
        200,
    )


@auth_bp.route("/login", methods=["POST"])
@validate_json_request
def login():
    from models.gym import Gym
    import logging

    logger = logging.getLogger(__name__)
    data = request.get_json()

    # Validate login data
    validate_login_data(data)

    gym = Gym.query.filter_by(email=data["email"]).first()
    if gym and gym.check_password(data["password"]):
        # Ensure gym.id is valid and convert to string
        gym_id = gym.id
        logger.info(f"Creating token for gym_id: {gym_id}, type: {type(gym_id)}")

        if gym_id is None:
            logger.error("Gym ID is None, cannot create token")
            return jsonify({"message": "Invalid user data"}), 500

        access_token = create_access_token(
            identity=str(gym_id)
        )  # used to create a JWT token for the user session.

        logger.info(f"Token created successfully for gym_id: {gym_id}")
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
    from models.gym import Gym
    from database import db

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
    from models.gym import Gym
    from database import db

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
    from models.gym import Gym
    from database import db

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
    from models.gym import Gym

    email = request.args.get("email")
    gym = Gym.query.filter_by(email=email).first()
    return (
        jsonify({"message": "gym profile fetched successfully", "gym": gym.to_dict()}),
        200 if gym else jsonify({"message": "gym not found"}),
        404,
    )


@auth_bp.route("/update_gym_profile", methods=["PUT"])
def update_gym_profile():
    from models.gym import Gym
    from database import db

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
    from models.gym import Gym
    from database import db

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
    from models.gym import Gym

    id = request.args.get("id")
    gym = Gym.query.filter_by(id=id).first()
    return (
        jsonify({"message": "gym fetched successfully", "gym": gym.to_dict()}),
        200 if gym else jsonify({"message": "gym not found"}),
        404,
    )


@auth_bp.route("/get_all_gyms", methods=["GET"])
def get_all_gyms():
    from models.gym import Gym

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
