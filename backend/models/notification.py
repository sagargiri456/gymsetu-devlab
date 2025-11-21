from database import db
from datetime import datetime


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(
        db.String(50), nullable=False
    )  # 'subscription_expired', 'subscription_expiring_soon'
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    gym = db.relationship("Gym", backref="notifications")
    member = db.relationship("Member", backref="notifications")

    def to_dict(self):
        return {
            "id": self.id,
            "gym_id": self.gym_id,
            "member_id": self.member_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "member_name": self.member.name if self.member else None,
        }
