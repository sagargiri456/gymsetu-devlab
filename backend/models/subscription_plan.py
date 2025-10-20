from app import db
from datetime import datetime


class SubscriptionPlan(db.Model):
    id = db.Column("subscription_plan_id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def add_subscription_plan(self, name, description, price, duration):
        self.name = name
        self.description = description
        self.price = price
        self.duration = duration
        self.created_at = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def update_subscription_plan(self, name, description, price, duration):
        self.name = name
        self.description = description
        self.price = price
        self.duration = duration
        db.session.commit()

    def remove_subscription_plan(self):
        db.session.delete(self)
        db.session.commit()
