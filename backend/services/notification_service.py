from database import db
from models.members import Member
from models.notification import Notification
from models.push_subscription import PushSubscription
from datetime import datetime, date
from sqlalchemy import func
import json
import logging
import os

logger = logging.getLogger(__name__)


def check_expired_memberships():
    """
    Check all members for expired subscriptions and create notifications.
    This function is called by the scheduler daily.
    """
    try:
        # Get current date (without time)
        today = date.today()
        logger.info(f"Checking expired memberships for date: {today}")

        # Find all members with expiration_date that has passed
        expired_members = Member.query.filter(
            Member.expiration_date.isnot(None),
            func.date(Member.expiration_date) < today,
            Member.is_active == True,
        ).all()

        logger.info(f"Found {len(expired_members)} expired memberships")

        notifications_created = 0
        for member in expired_members:
            # Check if notification already exists for this member today
            existing_notification = Notification.query.filter(
                Notification.member_id == member.id,
                Notification.type == "subscription_expired",
                func.date(Notification.created_at) == today,
            ).first()

            if not existing_notification:
                # Create notification for gym owner
                notification = Notification(
                    gym_id=member.gym_id,
                    member_id=member.id,
                    title="Member Subscription Expired",
                    message=f"Member {member.name} (ID: {member.id}) subscription has expired on {member.expiration_date.strftime('%Y-%m-%d') if member.expiration_date else 'N/A'}.",
                    type="subscription_expired",
                    is_read=False,
                )
                db.session.add(notification)
                notifications_created += 1
                logger.info(
                    f"Created notification for expired member: {member.name} (ID: {member.id})"
                )

        if notifications_created > 0:
            db.session.commit()
            logger.info(f"Created {notifications_created} new notifications")

            # Send push notifications to all subscribed gym owners
            for member in expired_members:
                send_push_notifications_for_gym(member.gym_id, member)

        return {
            "success": True,
            "expired_count": len(expired_members),
            "notifications_created": notifications_created,
        }
    except Exception as e:
        logger.error(f"Error checking expired memberships: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}


def send_push_notifications_for_gym(gym_id, member):
    """
    Send push notifications to all subscribed devices for a gym.
    """
    try:
        # Get all push subscriptions for this gym
        subscriptions = PushSubscription.query.filter_by(gym_id=gym_id).all()

        if not subscriptions:
            logger.info(f"No push subscriptions found for gym_id: {gym_id}")
            return

        # Import pywebpush here to avoid import errors if not installed
        try:
            from pywebpush import webpush, WebPushException
        except ImportError:
            logger.warning(
                "pywebpush not installed. Push notifications will not be sent."
            )
            return

        # Get VAPID keys from environment
        vapid_private_key = os.getenv("VAPID_PRIVATE_KEY")
        vapid_public_key = os.getenv("VAPID_PUBLIC_KEY")
        vapid_subject = os.getenv("VAPID_SUBJECT", "mailto:admin@gymsetu.com")

        if not vapid_private_key or not vapid_public_key:
            logger.warning(
                "VAPID keys not configured. Push notifications will not be sent."
            )
            return

        # Prepare notification payload
        payload = json.dumps(
            {
                "title": "Member Subscription Expired",
                "body": f"Member {member.name} subscription has expired.",
                "icon": "/images/logo.svg",
                "badge": "/images/logo.svg",
                "data": {
                    "member_id": member.id,
                    "gym_id": gym_id,
                    "type": "subscription_expired",
                },
            }
        )

        # Send to each subscription
        for subscription in subscriptions:
            try:
                subscription_data = json.loads(subscription.keys)
                webpush(
                    subscription_info={
                        "endpoint": subscription.endpoint,
                        "keys": subscription_data,
                    },
                    data=payload,
                    vapid_private_key=vapid_private_key,
                    vapid_claims={"sub": vapid_subject},
                )
                logger.info(f"Push notification sent successfully for gym_id: {gym_id}")
            except WebPushException as e:
                logger.error(
                    f"Failed to send push notification: {str(e)}. Removing invalid subscription."
                )
                # Remove invalid subscription
                db.session.delete(subscription)
            except Exception as e:
                logger.error(f"Unexpected error sending push notification: {str(e)}")

        db.session.commit()
    except Exception as e:
        logger.error(f"Error sending push notifications: {str(e)}")
        db.session.rollback()


def create_notification(gym_id, member_id, title, message, notification_type):
    """
    Helper function to create a notification.
    """
    try:
        notification = Notification(
            gym_id=gym_id,
            member_id=member_id,
            title=title,
            message=message,
            type=notification_type,
            is_read=False,
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        logger.error(f"Error creating notification: {str(e)}")
        db.session.rollback()
        return None
