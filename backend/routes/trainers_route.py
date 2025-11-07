from flask import Blueprint, request, jsonify
from database import db
from models.trainers import Trainer
from utils.auth_utils import owner_required

trainers_bp = Blueprint("trainers", __name__, url_prefix="/api/trainers")


@trainers_bp.route("/add_trainer", methods=["POST"])
@owner_required
def add_trainer(current_gym):
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    phone = data["phone"]
    address = data["address"]
    city = data["city"]
    state = data["state"]
    zip = data["zip"]
    trainer = Trainer(
        name=name,
        email=email,
        phone=phone,
        address=address,
        city=city,
        state=state,
        zip=zip,
        gym_id=current_gym.id,
    )
    db.session.add(trainer)
    db.session.commit()
    return jsonify({"success": True, "message": "Trainer added successfully"}), 201


@trainers_bp.route("/get_trainers", methods=["GET"])
@owner_required
def get_trainer(current_gym):
    id = request.args.get("id")
    if not id:
        return jsonify({"success": False, "message": "ID parameter is required"}), 400
    trainer = Trainer.query.filter_by(id=id, gym_id=current_gym.id).first()
    if not trainer:
        return jsonify({"success": False, "message": "Trainer not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Trainer fetched successfully",
                "trainer": trainer.to_dict(),
            }
        ),
        200,
    )


@trainers_bp.route("/update_trainer", methods=["PUT"])
@owner_required
def update_trainer(current_gym):
    data = request.get_json()

    # Support both trainer_id and id for compatibility
    trainer_id = data.get("trainer_id") or data.get("id")
    if not trainer_id:
        return jsonify({"error": "Trainer ID is required"}), 400

    trainer = Trainer.query.filter_by(id=trainer_id, gym_id=current_gym.id).first()
    if not trainer:
        return jsonify({"success": False, "message": "Trainer not found"}), 404

    # Update only the fields that are provided in the request (partial update)
    if "name" in data and data["name"]:
        trainer.name = data["name"]
    if "email" in data and data["email"]:
        # Check if email is being changed and if it already exists
        if data["email"] != trainer.email:
            existing_trainer = Trainer.query.filter_by(
                email=data["email"], gym_id=current_gym.id
            ).first()
            if existing_trainer:
                return jsonify({"error": "Trainer with this email already exists"}), 409
        trainer.email = data["email"]
    if "phone" in data and data["phone"]:
        trainer.phone = data["phone"]
    if "address" in data and data["address"]:
        trainer.address = data["address"]
    if "city" in data and data["city"]:
        trainer.city = data["city"]
    if "dp_link" in data:
        trainer.dp_link = data["dp_link"]  # dp_link can be None/empty
    if "state" in data and data["state"]:
        trainer.state = data["state"]
    if "zip" in data and data["zip"]:
        trainer.zip = data["zip"]

    db.session.commit()
    return jsonify({"success": True, "message": "Trainer updated successfully"}), 200


@trainers_bp.route("/delete_trainer", methods=["DELETE"])
@owner_required
def delete_trainer(current_gym):
    data = request.get_json()
    id = data["id"]
    trainer = Trainer.query.filter_by(id=id, gym_id=current_gym.id).first()
    if not trainer:
        return jsonify({"success": False, "message": "Trainer not found"}), 404
    db.session.delete(trainer)
    db.session.commit()
    return jsonify({"success": True, "message": "Trainer deleted successfully"}), 200


@trainers_bp.route("/get_trainer_by_id", methods=["GET"])
@owner_required
def get_trainer_by_id(current_gym):
    id = request.args.get("id")
    if not id:
        return jsonify({"success": False, "message": "ID parameter is required"}), 400
    trainer = Trainer.query.filter_by(id=id, gym_id=current_gym.id).first()
    if not trainer:
        return jsonify({"success": False, "message": "Trainer not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "message": "Trainer fetched successfully",
                "trainer": trainer.to_dict(),
            }
        ),
        200,
    )


@trainers_bp.route("/get_all_trainers", methods=["GET"])
@owner_required
def get_all_trainers(current_gym):
    trainers = Trainer.query.filter_by(gym_id=current_gym.id).all()
    return (
        jsonify(
            {
                "success": True,
                "message": "All trainers fetched successfully",
                "trainers": [trainer.to_dict() for trainer in trainers],
            }
        ),
        200,
    )
