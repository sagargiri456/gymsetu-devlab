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
    id = data["id"]
    name = data["name"]
    email = data["email"]
    phone = data["phone"]
    address = data["address"]
    city = data["city"]
    state = data["state"]
    zip = data["zip"]
    trainer = Trainer.query.filter_by(id=id, gym_id=current_gym.id).first()
    if not trainer:
        return jsonify({"success": False, "message": "Trainer not found"}), 404
    trainer.name = name
    trainer.email = email
    trainer.phone = phone
    trainer.address = address
    trainer.city = city
    trainer.state = state
    trainer.zip = zip
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
