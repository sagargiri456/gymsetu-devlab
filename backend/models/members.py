from app import db
from datetime import datetime


class Member(db.Model):
    id = db.Column("member_id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    gym = db.relationship("Gym", backref="members")
    subscriptions = db.relationship("Subscription", backref="members")

    def remove_member(self):
        db.session.delete(self)
        db.session.commit()
