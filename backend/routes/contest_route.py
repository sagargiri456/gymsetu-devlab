from flask import Blueprint, request, jsonify
from app import db
from models.contest import Contest
from models.participants import Participant
from utils.auth_utils import owner_required
from utils.validation import validate_contest_data, validate_json_request
from utils.middleware import handle_database_errors

contest_bp = Blueprint("contest", __name__, url_prefix="/api/contest")


@contest_bp.route("/add_contest", methods=["POST"])
@owner_required
@validate_json_request
@handle_database_errors
def add_contest(current_gym):
    data = request.get_json()
    name = data["name"]
    description = data["description"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    contest = Contest(
        name=name,
        description=description,
        start_date=start_date,
        end_date=end_date,
        gym_id=current_gym.id,
    )
    db.session.add(contest)
    db.session.commit()
    return jsonify({"success": True, "message": "Contest added successfully"}), 201


@contest_bp.route("/get_contest_by_id", methods=["GET"])
@owner_required
@validate_json_request
@handle_database_errors
def get_contest_by_id(current_gym):
    data = request.get_json()
    contest_id = data["contest_id"]
    contest = Contest.query.filter_by(id=contest_id, gym_id=current_gym.id).first()
    return (
        jsonify(
            {
                "success": True,
                "message": "Contest fetched successfully",
                "contest": contest,
            }
        ),
        200,
    )


@contest_bp.route("/get_all_contests", methods=["GET"])
@owner_required
@validate_json_request
@handle_database_errors
def get_all_contests(current_gym):
    contests = Contest.query.filter_by(gym_id=current_gym.id).all()
    return (
        jsonify(
            {
                "success": True,
                "message": "All contests fetched successfully",
                "contests": [contest.to_dict() for contest in contests],
            }
        ),
        200,
    )


@contest_bp.route("/delete_contest", methods=["DELETE"])
@owner_required
@validate_json_request
@handle_database_errors
def delete_contest(current_gym):
    data = request.get_json()
    contest_id = data["contest_id"]
    contest = Contest.query.filter_by(id=contest_id, gym_id=current_gym.id).first()
    if not contest:
        return jsonify({"success": False, "message": "Contest not found"}), 404
    db.session.delete(contest)
    db.session.commit()
    return jsonify({"success": True, "message": "Contest deleted successfully"}), 200


@contest_bp.route("/update_contest", methods=["PUT"])
@owner_required
@validate_json_request
@handle_database_errors
def update_contest(current_gym):
    data = request.get_json()
    contest_id = data["contest_id"]
    contest = Contest.query.filter_by(id=contest_id, gym_id=current_gym.id).first()
    if not contest:
        return jsonify({"success": False, "message": "Contest not found"}), 404
    contest.name = data["name"]
    contest.description = data["description"]
    contest.start_date = data["start_date"]
    contest.end_date = data["end_date"]
    db.session.commit()
    return jsonify({"success": True, "message": "Contest updated successfully"}), 200


@contest_bp.route("/get_all_participants", methods=["GET"])
@owner_required
@validate_json_request
@handle_database_errors
def get_all_participants(current_gym, contest_id):
    participants = Participant.query.filter_by(
        gym_id=current_gym.id, contest_id=contest_id
    ).all()
    return (
        jsonify(
            {
                "success": True,
                "message": "All participants fetched successfully",
                "participants": [participant.to_dict() for participant in participants],
            }
        ),
        200,
    )


@contest_bp.route("/get_participant_by_id", methods=["GET"])
@owner_required
@validate_json_request
@handle_database_errors
def get_participant_by_id(current_gym, contest_id, participant_id):
    participant = Participant.query.filter_by(
        id=participant_id, gym_id=current_gym.id, contest_id=contest_id
    ).first()
    if not participant:
        return jsonify({"success": False, "message": "Participant not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Participant fetched successfully",
                "participant": participant.to_dict(),
            }
        ),
        200,
    )
