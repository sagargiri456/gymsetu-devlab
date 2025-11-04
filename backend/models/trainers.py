from database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Trainer(db.Model):
    id = db.Column("trainer_id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(100), nullable=True)
    dob = db.Column(db.DateTime, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    height = db.Column(db.Float, nullable=True)
    experience = db.Column(db.Integer, nullable=True)
    specialization = db.Column(db.String(100), nullable=True)
    certifications = db.Column(db.String(100), nullable=True)
    availability = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.String(100), nullable=True)
    skills = db.Column(db.String(100), nullable=True)
    languages = db.Column(db.String(100), nullable=True)
    dp_link = db.Column(db.String(200), nullable=True)
    state = db.Column(db.String(100), nullable=False)
    zip = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    gym = db.relationship("Gym", backref="trainers")

    def set_password(self, password):
        """Hash and set the password"""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        if not self.password:
            return False
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "dp_link": self.dp_link,
            "state": self.state,
            "zip": self.zip,
            "gym_id": self.gym_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
