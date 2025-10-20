from flask import Blueprint
from models.subscription_plan import SubscriptionPlan
from app import db
from flask import request, jsonify
from utils.auth_utils import owner_required
from utils.validation import validate_subscription_plan_data, validate_json_request
from utils.middleware import handle_database_errors


subscription_plan_route = Blueprint(
    "subscription_plan_route", __name__, prefix_url="/api/subscription_plan"
)


@subscription_plan_route.route("/add_subscription_plan", methods=["POST"])
@owner_required
@validate_json_request
@handle_database_errors
def add_subscription_plan(current_gym):
    data = request.get_json()

    # Validate subscription plan data
    validate_subscription_plan_data(data)

    # Check if plan name already exists for this gym
    existing_plan = SubscriptionPlan.query.filter_by(
        name=data["name"], gym_id=current_gym.id
    ).first()
    if existing_plan:
        return (
            jsonify({"error": "Subscription plan with this name already exists"}),
            409,
        )

    subscription_plan = SubscriptionPlan(
        name=data["name"],
        description=data["description"],
        price=data["price"],
        duration=data["duration"],
        gym_id=current_gym.id,
    )
    db.session.add(subscription_plan)
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Subscription plan added successfully"}),
        201,
    )


@subscription_plan_route.route("/get_subscription_plans", methods=["GET"])
@owner_required
def get_subscription_plans(current_gym):
    subscription_plans = SubscriptionPlan.query.filter_by(gym_id=current_gym.id).all()
    return (
        jsonify(
            {
                "success": True,
                "message": "Subscription plans fetched successfully",
                "subscription_plans": [
                    subscription_plan.to_dict()
                    for subscription_plan in subscription_plans
                ],
            }
        ),
        200,
    )


@subscription_plan_route.route("/update_subscription_plan", methods=["PUT"])
@owner_required
def update_subscription_plan(current_gym):
    data = request.get_json()
    id = data["id"]
    name = data["name"]
    description = data["description"]
    price = data["price"]
    duration = data["duration"]
    subscription_plan = SubscriptionPlan.query.filter_by(
        id=id, gym_id=current_gym.id
    ).first()
    if not subscription_plan:
        return (
            jsonify({"success": False, "message": "Subscription plan not found"}),
            404,
        )

    subscription_plan.name = name
    subscription_plan.description = description
    subscription_plan.price = price
    subscription_plan.duration = duration
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Subscription plan updated successfully"}),
        200,
    )


@subscription_plan_route.route("/delete_subscription_plan", methods=["DELETE"])
@owner_required
def delete_subscription_plan(current_gym):
    data = request.get_json()
    id = data["id"]
    subscription_plan = SubscriptionPlan.query.filter_by(
        id=id, gym_id=current_gym.id
    ).first()
    if not subscription_plan:
        return (
            jsonify({"success": False, "message": "Subscription plan not found"}),
            404,
        )

    db.session.delete(subscription_plan)
    db.session.commit()
    return (
        jsonify({"success": True, "message": "Subscription plan deleted successfully"}),
        200,
    )
