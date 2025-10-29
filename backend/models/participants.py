from database import db
from datetime import datetime


class Participant(db.Model):
    id = db.Column("participant_id", db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"), nullable=False)
    member = db.relationship("Member", backref="participants")
    contest_id = db.Column(
        db.Integer, db.ForeignKey("contest.contest_id"), nullable=False
    )
    contest = db.relationship("Contest", overlaps="participants")
    contest_rank = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    gym = db.relationship("Gym", backref="participants")
    participant_status = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "member_id": self.member_id,
            "contest_id": self.contest_id,
            "gym_id": self.gym_id,
            "contest_rank": self.contest_rank,
            "participant_status": self.participant_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
