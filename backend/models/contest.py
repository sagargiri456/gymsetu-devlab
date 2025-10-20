from flask import db
from datetime import datetime


class Contest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.id"), nullable=False)
    gym = db.relationship("Gym", backref="contests")
    participants = db.relationship("Participant", backref="contest")
