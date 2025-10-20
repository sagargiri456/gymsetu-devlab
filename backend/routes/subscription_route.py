from flask import Blueprint, request, jsonify
from app import db
from models.subscription import Subscription
from utils.auth_utils import owner_required
from utils.validation import validate_subscription_data, validate_json_request
from utils.middleware import handle_database_errors


subscription_bp = Blueprint("subscription", __name__, url_prefix="/api/subscription")


@subscription_bp.route("/add_subscription", methods=["POST"])
@owner_required
@validate_json_request
@handle_database_errors
def add_subscription(current_gym):
    data = request.get_json()

    # Validate subscription data
    validate_subscription_data(data)

    member_id = data["member_id"]
    gym_id = data.get("gym_id", current_gym.id)
    subscription_plan = data["subscription_plan"]
    subscription_status = data["subscription_status"]
    start_date = data["start_date"]
    end_date = data["end_date"]

    # Check if member already has an active subscription
    existing_subscription = Subscription.query.filter_by(
        member_id=member_id, gym_id=gym_id, subscription_status="active"
    ).first()
    if existing_subscription:
        return jsonify({"error": "Member already has an active subscription"}), 409

    subscription = Subscription(
        member_id=member_id,
        gym_id=gym_id,
        subscription_plan=subscription_plan,
        subscription_status=subscription_status,
        start_date=start_date,
        end_date=end_date,
    )
    db.session.add(subscription)
    db.session.commit()
    return jsonify({"success": True, "message": "Subscription added successfully"}), 201


@subscription_bp.route("/get_subscription", methods=["GET"])
@owner_required
def get_subscription(current_gym):
    data = request.get_json()
    member_id = data["member_id"]
    gym_id = data.get("gym_id", current_gym.id)
    subscription = Subscription.query.filter_by(
        member_id=member_id, gym_id=gym_id
    ).first()
    if not subscription:
        return jsonify({"success": False, "message": "Subscription not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Subscription fetched successfully",
                "subscription": subscription.to_dict(),
            }
        ),
        200,
    )


@subscription_bp.route("/update_subscription", methods=["PUT"])
@owner_required
def update_subscription(current_gym):
    data = request.get_json()
    member_id = data["member_id"]
    gym_id = data.get("gym_id", current_gym.id)
    subscription_plan = data["subscription_plan"]
    subscription_status = data["subscription_status"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    subscription = Subscription.query.filter_by(
        member_id=member_id, gym_id=gym_id
    ).first()
    if not subscription:
        return jsonify({"success": False, "message": "Subscription not found"}), 404

    subscription.subscription_plan = subscription_plan
    subscription.subscription_status = subscription_status
    subscription.start_date = start_date
    subscription.end_date = end_date
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Subscription updated successfully"}),
        200,
    )


@subscription_bp.route("/delete_subscription", methods=["DELETE"])
@owner_required
def delete_subscription(current_gym):
    data = request.get_json()
    member_id = data["member_id"]
    gym_id = data.get("gym_id", current_gym.id)
    subscription = Subscription.query.filter_by(
        member_id=member_id, gym_id=gym_id
    ).first()
    if not subscription:
        return jsonify({"success": False, "message": "Subscription not found"}), 404

    db.session.delete(subscription)
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Subscription deleted successfully"}),
        200,
    )
