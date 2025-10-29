from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    # JWT token expiration time
    # Options: timedelta(hours=24) for 24 hours, timedelta(days=7) for 7 days, etc.
    # Default if not set: 15 minutes
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)  # Change this value as needed
