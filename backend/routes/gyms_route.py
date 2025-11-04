from flask import Blueprint, jsonify
from models.gym import Gym
from database import db

gyms_bp = Blueprint("gyms", __name__, url_prefix="/api/gyms")


@gyms_bp.route("/get_gyms", methods=["GET"])
def get_gyms():
    """Get list of all gyms for dropdown selection (public endpoint)"""
    try:
        gyms = Gym.query.all()
        gyms_list = [
            {
                "id": gym.id,
                "name": gym.name,
                "email": gym.email,
                "city": gym.city,
                "state": gym.state,
            }
            for gym in gyms
        ]
        return jsonify({"success": True, "gyms": gyms_list}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
