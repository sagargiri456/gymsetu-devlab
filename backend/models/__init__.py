from database import db

# Import all models to ensure they are registered with SQLAlchemy
from .gym import Gym
from .members import Member
from .subscription import Subscription
from .subscription_plan import SubscriptionPlan
from .trainers import Trainer
from .contest import Contest
from .participants import Participant

__all__ = [
    "Gym",
    "Member",
    "Subscription",
    "SubscriptionPlan",
    "Trainer",
    "Contest",
    "Participant",
]
