from flask import Blueprint, request, jsonify
from database import db
from models.notification import Notification
from models.push_subscription import PushSubscription
from utils.auth_utils import owner_required
from utils.middleware import handle_database_errors
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

notification_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


@notification_bp.route("/", methods=["GET"], strict_slashes=False)
@owner_required
@handle_database_errors
def get_notifications(current_gym):
    """Get all notifications for the current gym"""
    try:
        # Get query parameters
        limit = request.args.get("limit", type=int, default=50)
        # Handle unread_only parameter correctly (Flask's type=bool doesn't work as expected)
        unread_only_str = request.args.get("unread_only", "false").lower()
        unread_only = unread_only_str in ("true", "1", "yes")

        # Build query
        query = Notification.query.filter_by(gym_id=current_gym.id)

        if unread_only:
            query = query.filter_by(is_read=False)

        # Order by created_at descending (newest first)
        notifications = (
            query.order_by(Notification.created_at.desc()).limit(limit).all()
        )

        return (
            jsonify(
                {
                    "success": True,
                    "notifications": [
                        notification.to_dict() for notification in notifications
                    ],
                    "count": len(notifications),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@notification_bp.route("/unread-count", methods=["GET"])
@owner_required
@handle_database_errors
def get_unread_count(current_gym):
    """Get count of unread notifications"""
    try:
        count = Notification.query.filter_by(
            gym_id=current_gym.id, is_read=False
        ).count()

        return jsonify({"success": True, "count": count}), 200
    except Exception as e:
        logger.error(f"Error fetching unread count: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@notification_bp.route("/<int:notification_id>/read", methods=["PUT"])
@owner_required
@handle_database_errors
def mark_as_read(current_gym, notification_id):
    """Mark a notification as read"""
    try:
        notification = Notification.query.filter_by(
            id=notification_id, gym_id=current_gym.id
        ).first()

        if not notification:
            return jsonify({"success": False, "error": "Notification not found"}), 404

        notification.is_read = True
        db.session.commit()

        return jsonify({"success": True, "message": "Notification marked as read"}), 200
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@notification_bp.route("/mark-all-read", methods=["PUT"])
@owner_required
@handle_database_errors
def mark_all_as_read(current_gym):
    """Mark all notifications as read for the current gym"""
    try:
        updated = Notification.query.filter_by(
            gym_id=current_gym.id, is_read=False
        ).update({"is_read": True})

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": f"Marked {updated} notifications as read",
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Error marking all notifications as read: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@notification_bp.route("/subscribe", methods=["POST"])
@owner_required
@handle_database_errors
def subscribe_push_notifications(current_gym):
    """Subscribe to push notifications"""
    try:
        data = request.get_json()

        if not data or "endpoint" not in data or "keys" not in data:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Missing required fields: endpoint and keys",
                    }
                ),
                400,
            )

        endpoint = data["endpoint"]
        keys = json.dumps(data["keys"])  # Store as JSON string

        # Check if subscription already exists
        existing = PushSubscription.query.filter_by(
            gym_id=current_gym.id, endpoint=endpoint
        ).first()

        if existing:
            # Update existing subscription
            existing.keys = keys
            db.session.commit()
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Push subscription updated",
                        "subscription": existing.to_dict(),
                    }
                ),
                200,
            )
        else:
            # Create new subscription
            subscription = PushSubscription(
                gym_id=current_gym.id, endpoint=endpoint, keys=keys
            )
            db.session.add(subscription)
            db.session.commit()
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Push subscription created",
                        "subscription": subscription.to_dict(),
                    }
                ),
                201,
            )
    except Exception as e:
        logger.error(f"Error subscribing to push notifications: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@notification_bp.route("/unsubscribe", methods=["POST"])
@owner_required
@handle_database_errors
def unsubscribe_push_notifications(current_gym):
    """Unsubscribe from push notifications"""
    try:
        data = request.get_json()

        if not data or "endpoint" not in data:
            return (
                jsonify(
                    {"success": False, "error": "Missing required field: endpoint"}
                ),
                400,
            )

        endpoint = data["endpoint"]

        subscription = PushSubscription.query.filter_by(
            gym_id=current_gym.id, endpoint=endpoint
        ).first()

        if not subscription:
            return (
                jsonify({"success": False, "error": "Subscription not found"}),
                404,
            )

        db.session.delete(subscription)
        db.session.commit()

        return jsonify({"success": True, "message": "Unsubscribed successfully"}), 200
    except Exception as e:
        logger.error(f"Error unsubscribing from push notifications: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
