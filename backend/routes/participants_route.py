from flask import Blueprint, request, jsonify
from app import db
from models.participants import Participant
from utils.auth_utils import owner_required
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
