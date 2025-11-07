from flask import Blueprint, request, jsonify
from database import db
from models.contest import Contest
from models.participants import Participant
from utils.auth_utils import owner_required
from utils.validation import validate_json_request
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
    banner_link = data.get("banner_link")  # Optional field
    contest = Contest(
        name=name,
        description=description,
        start_date=start_date,
        end_date=end_date,
        banner_link=banner_link,
        gym_id=current_gym.id,
    )
    db.session.add(contest)
    db.session.commit()
    return (
        jsonify(
            {
                "success": True,
                "message": "Contest added successfully",
                "contest": contest.to_dict(),
            }
        ),
        201,
    )


@contest_bp.route("/get_contest_by_id", methods=["GET"])
@owner_required
@handle_database_errors
def get_contest_by_id(current_gym):
    contest_id = request.args.get("contest_id")
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
@handle_database_errors
def get_all_participants(current_gym):
    contest_id = request.args.get("contest_id")
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
@handle_database_errors
def get_participant_by_id(current_gym):
    contest_id = request.args.get("contest_id")
    participant_id = request.args.get("participant_id")
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


@contest_bp.route("/get_leaderboard", methods=["GET"])
@owner_required
@handle_database_errors
def get_leaderboard(current_gym):
    from models.members import Member

    contest_id = request.args.get("contest_id")

    # If contest_id not provided, get the first active contest
    if not contest_id:
        contest = Contest.query.filter_by(gym_id=current_gym.id).first()
        if not contest:
            return jsonify({"success": False, "message": "No contests found"}), 404
        contest_id = contest.id
    else:
        contest = Contest.query.filter_by(id=contest_id, gym_id=current_gym.id).first()
        if not contest:
            return jsonify({"success": False, "message": "Contest not found"}), 404

    # Get participants sorted by contest_rank
    participants = (
        Participant.query.filter_by(gym_id=current_gym.id, contest_id=contest_id)
        .order_by(Participant.contest_rank.asc())
        .all()
    )

    # Build leaderboard with member names
    leaderboard = []
    for participant in participants:
        member = Member.query.get(participant.member_id)
        member_name = member.name if member else f"Member #{participant.member_id}"

        # Calculate score (using 1000 - rank*10 as a simple scoring system)
        # You can modify this based on your actual scoring logic
        score = 1000 - (participant.contest_rank - 1) * 10

        leaderboard.append(
            {
                "id": participant.id,
                "member_id": participant.member_id,
                "contest_id": participant.contest_id,
                "contest_rank": participant.contest_rank,
                "participant_status": participant.participant_status,
                "member_name": member_name,
                "score": max(score, 0),  # Ensure score is not negative
            }
        )

    return (
        jsonify(
            {
                "success": True,
                "message": "Leaderboard fetched successfully",
                "contest": contest.to_dict(),
                "leaderboard": leaderboard,
            }
        ),
        200,
    )
