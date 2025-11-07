from flask import Blueprint, request, jsonify
from database import db
from models.participants import Participant
from models.contest import Contest
from utils.auth_utils import owner_required, member_required
from utils.validation import validate_json_request
from utils.middleware import handle_database_errors

participants_bp = Blueprint("participants", __name__, url_prefix="/api/participants")


@participants_bp.route("/add_participantion", methods=["POST"])
@owner_required
@validate_json_request
@handle_database_errors
def add_participant(current_gym, contest_id):
    data = request.get_json()
    member_id = data["member_id"]
    participant = Participant(
        member_id=member_id, contest_id=contest_id, gym_id=current_gym.id
    )
    db.session.add(participant)
    db.session.commit()
    return jsonify({"success": True, "message": "Participant added successfully"}), 201


@participants_bp.route("/delete_participantion", methods=["DELETE"])
@owner_required
@validate_json_request
@handle_database_errors
def delete_participant(current_gym, contest_id, participant_id):
    participant = Participant.query.filter_by(
        id=participant_id, gym_id=current_gym.id, contest_id=contest_id
    ).first()
    if not participant:
        return jsonify({"success": False, "message": "Participant not found"}), 404
    db.session.delete(participant)
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Participant deleted successfully"}),
        200,
    )


@participants_bp.route("/register", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def register_for_contest(member_id, gym_id, member):
    """Allow members to register themselves for a contest"""
    data = request.get_json()
    contest_id = data.get("contest_id")

    if not contest_id:
        return jsonify({"success": False, "message": "Contest ID is required"}), 400

    # Check if contest exists and belongs to the same gym
    contest = Contest.query.filter_by(id=contest_id, gym_id=gym_id).first()
    if not contest:
        return jsonify({"success": False, "message": "Contest not found"}), 404

    # Check if member is already registered
    existing_participant = Participant.query.filter_by(
        member_id=member_id, contest_id=contest_id, gym_id=gym_id
    ).first()

    if existing_participant:
        return (
            jsonify(
                {"success": False, "message": "Already registered for this contest"}
            ),
            400,
        )

    # Get the next rank (highest rank + 1)
    highest_rank = (
        db.session.query(db.func.max(Participant.contest_rank))
        .filter_by(contest_id=contest_id, gym_id=gym_id)
        .scalar()
        or 0
    )

    # Create new participant with initial rank
    participant = Participant(
        member_id=member_id,
        contest_id=contest_id,
        gym_id=gym_id,
        contest_rank=highest_rank + 1,
        participant_status="active",
    )

    db.session.add(participant)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "Successfully registered for contest",
                "participant": participant.to_dict(),
            }
        ),
        201,
    )


@participants_bp.route("/check_registration", methods=["GET"])
@member_required
@handle_database_errors
def check_registration(member_id, gym_id, member):
    """Check if a member is registered for a contest"""
    contest_id = request.args.get("contest_id")

    if not contest_id:
        return jsonify({"success": False, "message": "Contest ID is required"}), 400

    participant = Participant.query.filter_by(
        member_id=member_id, contest_id=contest_id, gym_id=gym_id
    ).first()

    return (
        jsonify(
            {
                "success": True,
                "is_registered": participant is not None,
                "participant": participant.to_dict() if participant else None,
            }
        ),
        200,
    )
