from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class Gym(db.Model):
    id = db.Column("gym_id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    otp = db.Column(db.String(10), nullable=True)
    role = db.Column(db.String(20), nullable=False, default="owner")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def is_owner(self):
        """Check if the gym has owner role"""
        return self.role == "owner"

    def has_role(self, required_role):
        """Check if the gym has the required role"""
        return self.role == required_role

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "phone": self.phone,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
