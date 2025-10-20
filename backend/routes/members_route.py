from flask import Blueprint, request, jsonify
from app import db
from models.members import Member
from utils.auth_utils import owner_required
from utils.validation import validate_member_data, validate_json_request
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


@members_bp.route("/get_member", methods=["GET"])
@owner_required
def get_member(current_gym):
    data = request.get_json()
    gym_id = data.get("gym_id", current_gym.id)
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

    # Validate member data
    validate_member_data(data)

    member_id = data.get("member_id")
    if not member_id:
        return jsonify({"error": "Member ID is required"}), 400

    member = Member.query.filter_by(id=member_id, gym_id=current_gym.id).first()
    if not member:
        return jsonify({"success": False, "message": "Member not found"}), 404

    # Check if email is being changed and if it already exists
    if data["email"] != member.email:
        existing_member = Member.query.filter_by(
            email=data["email"], gym_id=current_gym.id
        ).first()
        if existing_member:
            return jsonify({"error": "Member with this email already exists"}), 409

    member.name = data["name"]
    member.email = data["email"]
    member.phone = data["phone"]
    member.address = data["address"]
    member.city = data["city"]
    member.state = data["state"]
    member.zip = data["zip"]
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
    data = request.get_json()
    member_id = data["member_id"]
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
    data = request.get_json()
    email = data["email"]
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
