from app import db
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
