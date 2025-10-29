from database import db
from datetime import datetime, timedelta


class Subscription(db.Model):
    id = db.Column("subscription_id", db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"), nullable=False)
    member = db.relationship("Member", backref="subscriptions")
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    gym = db.relationship("Gym", backref="subscriptions")
    subscription_plan = db.Column(db.String(100), nullable=False)
    subscription_status = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def is_active(self):
        return (
            datetime.utcnow() <= self.end_date and self.subscription_status == "active"
        )

    def to_dict(self):
        return {
            "id": self.id,
            "member_id": self.member_id,
            "gym_id": self.gym_id,
            "subscription_plan": self.subscription_plan,
            "subscription_status": self.subscription_status,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
