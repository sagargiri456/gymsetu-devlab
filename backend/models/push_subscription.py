from database import db
from datetime import datetime


class PushSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    endpoint = db.Column(db.Text, nullable=False)
    keys = db.Column(
        db.Text, nullable=False
    )  # JSON string containing auth and p256dh keys
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    gym = db.relationship("Gym", backref="push_subscriptions")

    def to_dict(self):
        return {
            "id": self.id,
            "gym_id": self.gym_id,
            "endpoint": self.endpoint,
            "keys": self.keys,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
