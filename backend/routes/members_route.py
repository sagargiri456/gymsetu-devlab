from flask import Blueprint, request, jsonify
from database import db
from models.members import Member
from utils.auth_utils import owner_required
from utils.validation import (
    validate_member_data,
    validate_member_update_data,
    validate_json_request,
)
from utils.middleware import handle_database_errors

members_bp = Blueprint("members", __name__, url_prefix="/api/members")


@members_bp.route("/add_member", methods=["POST"])
@owner_required
@validate_json_request
@handle_database_errors
def add_member(current_gym):
    data = request.get_json()

    # Validate member data
    validate_member_data(data)

    # Check if email already exists for this gym
    existing_member = Member.query.filter_by(
        email=data["email"], gym_id=current_gym.id
    ).first()
    if existing_member:
        return jsonify({"error": "Member with this email already exists"}), 409

    member = Member(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        address=data["address"],
        city=data["city"],
        state=data["state"],
        zip=data["zip"],
        gym_id=current_gym.id,
    )
    db.session.add(member)
    db.session.commit()

    return jsonify({"success": True, "message": "Member added successfully"}), 201


@members_bp.route("/get_members", methods=["GET"])
@owner_required
@handle_database_errors
def get_member(current_gym):
    gym_id = request.args.get("gym_id", current_gym.id)
    members = Member.query.filter_by(gym_id=gym_id).all()
    return (
        jsonify(
            {
                "success": True,
                "message": "Members fetched successfully",
                "members": [member.to_dict() for member in members],
            }
        ),
        200,
    )


@members_bp.route("/update_member", methods=["PUT"])
@owner_required
@validate_json_request
@handle_database_errors
def update_member(current_gym):
    data = request.get_json()

    # Validate member update data (only validates fields that are provided)
    validate_member_update_data(data)

    member_id = data.get("member_id")
    print(member_id)
    if not member_id:
        return jsonify({"error": "Member ID is required"}), 400

    member = Member.query.filter_by(id=member_id, gym_id=current_gym.id).first()
    print(member)
    if not member:
        return jsonify({"success": False, "message": "Member not found"}), 404

    # Check if email is being changed and if it already exists
    # if data["email"] != member.email:
    #     existing_member = Member.query.filter_by(
    #         email=data["email"], gym_id=current_gym.id
    #     ).first()

    if member:
        # Update only the fields that are provided in the request
        if "name" in data and data["name"]:
            member.name = data["name"]
        if "email" in data and data["email"]:
            member.email = data["email"]
        if "phone" in data and data["phone"]:
            member.phone = data["phone"]
        if "address" in data and data["address"]:
            member.address = data["address"]
        if "city" in data and data["city"]:
            member.city = data["city"]
        if "dp_link" in data:
            member.dp_link = data["dp_link"]  # dp_link can be None/empty
        if "expiration_date" in data and data["expiration_date"]:
            member.expiration_date = data["expiration_date"]
        if "state" in data and data["state"]:
            member.state = data["state"]
        if "zip" in data and data["zip"]:
            member.zip = data["zip"]

        # Check if email is being changed and if it already exists
        if "email" in data and data["email"] != member.email:
            existing_member = Member.query.filter_by(
                email=data["email"], gym_id=current_gym.id
            ).first()
            if existing_member:
                return jsonify({"error": "Member with this email already exists"}), 409

        db.session.commit()

    return jsonify({"success": True, "message": "Member updated successfully"}), 200


@members_bp.route("/delete_member", methods=["DELETE"])
@owner_required
def delete_member(current_gym):
    data = request.get_json()
    member_id = data["member_id"]
    member = Member.query.filter_by(id=member_id, gym_id=current_gym.id).first()
    if not member:
        return jsonify({"success": False, "message": "Member not found"}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"success": True, "message": "Member deleted successfully"}), 200


@members_bp.route("/get_member_by_id", methods=["GET"])
@owner_required
def get_member_by_id(current_gym):
    member_id = request.args.get("member_id")
    member = Member.query.filter_by(id=member_id, gym_id=current_gym.id).first()
    if not member:
        return jsonify({"success": False, "message": "Member not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Member fetched successfully",
                "member": member.to_dict(),
            }
        ),
        200,
    )


@members_bp.route("/get_member_by_email", methods=["GET"])
@owner_required
def get_member_by_email(current_gym):
    email = request.args.get("email")
    member = Member.query.filter_by(email=email, gym_id=current_gym.id).first()
    if not member:
        return jsonify({"success": False, "message": "Member not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Member fetched successfully",
                "member": member.to_dict(),
            }
        ),
        200,
    )
