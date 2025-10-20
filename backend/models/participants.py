from flask import db
from datetime import datetime


class Participant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)
    member = db.relationship("Member", backref="participants")
    contest_id = db.Column(db.Integer, db.ForeignKey("contest.id"), nullable=False)
    contest = db.relationship("Contest", backref="participants")
    conteset_rank = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.id"), nullable=False)
    gym = db.relationship("Gym", backref="participants")
    participant_status = db.Column(db.String(100), nullable=False)
    participant_status = db.Column(db.String(100), nullable=False)
