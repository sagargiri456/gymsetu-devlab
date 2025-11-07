from flask import Blueprint, request, jsonify
from database import db
from models.members import Member
from models.trainers import Trainer
from models.contest import Contest
from models.subscription import Subscription
from models.participants import Participant
from utils.auth_utils import owner_required, member_required
from utils.validation import (
    validate_member_data,
    validate_member_update_data,
    validate_json_request,
)
from utils.middleware import handle_database_errors
from datetime import datetime, timedelta

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


# ========== MEMBER-FACING ENDPOINTS ==========


@members_bp.route("/get_member_dashboard", methods=["GET"])
@member_required
@handle_database_errors
def get_member_dashboard(member_id, gym_id, member):
    """Get member dashboard data including stats and subscription info"""
    try:
        # Get active subscription
        subscription = (
            Subscription.query.filter_by(member_id=member_id, gym_id=gym_id)
            .order_by(Subscription.created_at.desc())
            .first()
        )

        # Calculate days remaining
        days_remaining = 0
        if subscription and subscription.end_date:
            days_remaining = max(0, (subscription.end_date - datetime.utcnow()).days)

        # Calculate active days (days since joining)
        active_days = 0
        if member.created_at:
            active_days = (datetime.utcnow() - member.created_at).days

        # Calculate workouts this week (placeholder - would need workout tracking model)
        workouts_this_week = {"completed": 0, "total": 0}

        # Get contests joined
        contests_joined = Participant.query.filter_by(
            member_id=member_id, gym_id=gym_id
        ).count()

        # Build member data
        member_data = member.to_dict()
        member_data.update(
            {
                "phone": member.phone,
                "address": member.address,
                "city": member.city,
                "state": member.state,
                "zipCode": member.zip,
                "dateOfBirth": member.dob.isoformat() if member.dob else None,
                "gender": member.gender,
                "fitnessGoals": None,  # Would need additional field
                "profilePhoto": member.dp_link,
                "subscription": {
                    "status": subscription.subscription_status
                    if subscription
                    else "Expired",
                    "daysRemaining": days_remaining,
                    "plan": subscription.subscription_plan if subscription else "None",
                    "startDate": subscription.start_date.isoformat()
                    if subscription and subscription.start_date
                    else None,
                    "endDate": subscription.end_date.isoformat()
                    if subscription and subscription.end_date
                    else None,
                },
                "stats": {
                    "weight": member.weight or 0,
                    "height": member.height or 0,
                    "bmi": (member.weight / ((member.height / 100) ** 2))
                    if member.weight and member.height
                    else 0,
                    "joinDate": member.created_at.isoformat()
                    if member.created_at
                    else None,
                },
            }
        )

        stats_data = {
            "activeDays": active_days,
            "daysRemaining": days_remaining,
            "workoutsThisWeek": workouts_this_week,
            "contestsJoined": contests_joined,
        }

        return (
            jsonify(
                {
                    "success": True,
                    "member": member_data,
                    "stats": stats_data,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/get_member_profile", methods=["GET"])
@member_required
@handle_database_errors
def get_member_profile(member_id, gym_id, member):
    """Get member profile data"""
    try:
        member_data = member.to_dict()
        member_data.update(
            {
                "phone": member.phone,
                "address": member.address,
                "city": member.city,
                "state": member.state,
                "zipCode": member.zip,
                "dateOfBirth": member.dob.isoformat() if member.dob else None,
                "gender": member.gender,
                "fitnessGoals": None,
                "profilePhoto": member.dp_link,
                "stats": {
                    "weight": member.weight or 0,
                    "height": member.height or 0,
                    "bmi": (member.weight / ((member.height / 100) ** 2))
                    if member.weight and member.height
                    else 0,
                    "joinDate": member.created_at.isoformat()
                    if member.created_at
                    else None,
                },
            }
        )

        return (
            jsonify(
                {
                    "success": True,
                    "member": member_data,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/update_profile", methods=["PUT"])
@member_required
@validate_json_request
@handle_database_errors
def update_member_profile(member_id, gym_id, member):
    """Update member profile"""
    try:
        data = request.get_json()

        # Update fields if provided
        if "name" in data:
            member.name = data["name"]
        if "email" in data:
            member.email = data["email"]
        if "phone" in data:
            member.phone = data["phone"]
        if "address" in data:
            member.address = data["address"]
        if "city" in data:
            member.city = data["city"]
        if "state" in data:
            member.state = data["state"]
        if "zipCode" in data:
            member.zip = data["zipCode"]
        if "dateOfBirth" in data:
            try:
                member.dob = datetime.fromisoformat(
                    data["dateOfBirth"].replace("Z", "+00:00")
                )
            except:
                pass
        if "gender" in data:
            member.gender = data["gender"]
        if "height" in data:
            member.height = data["height"]
        if "weight" in data:
            member.weight = data["weight"]

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Profile updated successfully",
                    "member": member.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/get_workout_plan", methods=["GET"])
@member_required
@handle_database_errors
def get_workout_plan(member_id, gym_id, member):
    """Get member workout plan (placeholder - would need workout plan model)"""
    # Return placeholder data structure
    return (
        jsonify(
            {
                "success": True,
                "workoutPlan": {
                    "name": "No Workout Plan",
                    "duration": "N/A",
                    "progress": 0,
                    "daysPerWeek": 0,
                    "weeklySchedule": [],
                    "exercises": {},
                },
            }
        ),
        200,
    )


@members_bp.route("/get_diet_plan", methods=["GET"])
@member_required
@handle_database_errors
def get_diet_plan(member_id, gym_id, member):
    """Get member diet plan (placeholder - would need diet plan model)"""
    # Return placeholder data structure
    return (
        jsonify(
            {
                "success": True,
                "dietPlan": {
                    "name": "No Diet Plan",
                    "duration": "N/A",
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fats": 0,
                    "meals": [],
                },
            }
        ),
        200,
    )


@members_bp.route("/get_my_trainer", methods=["GET"])
@member_required
@handle_database_errors
def get_my_trainer(member_id, gym_id, member):
    """Get member's assigned trainer"""
    try:
        # Get first trainer from the gym (placeholder - would need trainer assignment model)
        trainer = Trainer.query.filter_by(gym_id=gym_id, is_active=True).first()

        if not trainer:
            return (
                jsonify(
                    {
                        "success": True,
                        "trainer": None,
                        "message": "No trainer assigned",
                    }
                ),
                200,
            )

        trainer_data = trainer.to_dict()
        trainer_data.update(
            {
                "specialization": trainer.specialization,
                "experience": trainer.experience,
                "bio": trainer.bio,
                "photo": trainer.dp_link,
            }
        )

        return (
            jsonify(
                {
                    "success": True,
                    "trainer": trainer_data,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/get_contests", methods=["GET"])
@member_required
@handle_database_errors
def get_contests(member_id, gym_id, member):
    """Get contests available to member"""
    try:
        # Get all contests for the gym
        contests = Contest.query.filter_by(gym_id=gym_id).all()

        # Get contests the member has joined
        joined_contest_ids = [
            p.contest_id
            for p in Participant.query.filter_by(
                member_id=member_id, gym_id=gym_id
            ).all()
        ]

        contests_data = []
        for contest in contests:
            contest_dict = contest.to_dict()
            # Determine status
            now = datetime.utcnow()
            if contest.start_date > now:
                status = "upcoming"
            elif contest.end_date < now:
                status = "completed"
            else:
                status = "ongoing"

            # Get participant count
            participants_count = Participant.query.filter_by(
                contest_id=contest.id
            ).count()

            contests_data.append(
                {
                    "id": str(contest.id),
                    "name": contest.name,
                    "description": contest.description,
                    "startDate": contest.start_date.isoformat()
                    if contest.start_date
                    else None,
                    "endDate": contest.end_date.isoformat()
                    if contest.end_date
                    else None,
                    "status": status,
                    "participants": participants_count,
                    "prize": "Trophy",  # Placeholder
                    "joined": contest.id in joined_contest_ids,
                }
            )

        return (
            jsonify(
                {
                    "success": True,
                    "contests": contests_data,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/get_progress", methods=["GET"])
@member_required
@handle_database_errors
def get_progress(member_id, gym_id, member):
    """Get member progress data (placeholder - would need progress tracking model)"""
    # Return placeholder data structure
    return (
        jsonify(
            {
                "success": True,
                "progress": [],
            }
        ),
        200,
    )


@members_bp.route("/log_progress", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def log_progress(member_id, gym_id, member):
    """Log new progress entry (placeholder - would need progress tracking model)"""
    try:
        data = request.get_json()
        # Would save to progress tracking model here
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Progress logged successfully",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/mark_exercise_complete", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def mark_exercise_complete(member_id, gym_id, member):
    """Mark exercise as complete (placeholder - would need workout tracking model)"""
    try:
        data = request.get_json()
        # Would update workout tracking model here
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Exercise marked as complete",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/mark_meal_complete", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def mark_meal_complete(member_id, gym_id, member):
    """Mark meal as complete (placeholder - would need diet tracking model)"""
    try:
        data = request.get_json()
        # Would update diet tracking model here
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Meal marked as complete",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/send_trainer_message", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def send_trainer_message(member_id, gym_id, member):
    """Send message to trainer (placeholder - would need messaging model)"""
    try:
        data = request.get_json()
        message = data.get("message", "")
        # Would save to messaging model here
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Message sent successfully",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/request_session", methods=["POST"])
@member_required
@validate_json_request
@handle_database_errors
def request_session(member_id, gym_id, member):
    """Request training session (placeholder - would need session booking model)"""
    try:
        data = request.get_json()
        # Would save to session booking model here
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Session requested successfully",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@members_bp.route("/get_todays_schedule", methods=["GET"])
@member_required
@handle_database_errors
def get_todays_schedule(member_id, gym_id, member):
    """Get today's schedule for member (placeholder - would need schedule model)"""
    # Return placeholder data structure
    return (
        jsonify(
            {
                "success": True,
                "schedule": [],
            }
        ),
        200,
    )


@members_bp.route("/get_weekly_progress", methods=["GET"])
@member_required
@handle_database_errors
def get_weekly_progress(member_id, gym_id, member):
    """Get weekly progress data (placeholder - would need progress tracking model)"""
    # Return placeholder data structure with default values
    today = datetime.utcnow()
    week_start = today - timedelta(days=today.weekday())

    weekly_progress = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        day_name = day.strftime("%a")
        weekly_progress.append(
            {
                "day": day_name,
                "value": 0,  # Would calculate from progress tracking model
            }
        )

    return (
        jsonify(
            {
                "success": True,
                "weeklyProgress": weekly_progress,
            }
        ),
        200,
    )
