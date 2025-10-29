from dotenv import load_dotenv
import os
from datetime import timedelta
from urllib.parse import urlparse, urlunparse

load_dotenv()


def get_database_url():
    """Get and format database URL for production"""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        raise ValueError(
            "DATABASE_URL environment variable is not set. "
            "Please set it in your environment variables."
        )
    
    # Handle PostgreSQL URLs for production (Render, Heroku, etc.)
    # Add SSL requirement for production databases
    if database_url.startswith("postgres://"):
        # Convert postgres:// to postgresql:// (required by SQLAlchemy 2.x)
        database_url = database_url.replace("postgres://", "postgresql://", 1)
        
        # Parse the URL
        parsed = urlparse(database_url)
        
        # Add SSL mode for production databases
        # Common providers like Render require SSL
        if "sslmode" not in parsed.query:
            # Add sslmode=require for production
            query_parts = parsed.query.split("&") if parsed.query else []
            query_parts.append("sslmode=require")
            new_query = "&".join(query_parts)
            
            # Reconstruct URL with SSL mode
            database_url = urlunparse((
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment
            ))
    
    return database_url


class Config:
    SQLALCHEMY_DATABASE_URI = get_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Connection pool settings for production
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,  # Verify connections before using
        "pool_recycle": 300,    # Recycle connections after 5 minutes
        "pool_size": 10,        # Number of connections to maintain
        "max_overflow": 20,     # Maximum number of additional connections
        "echo": os.getenv("SQL_DEBUG", "False").lower() == "true",  # Log SQL queries if debug is enabled
    }
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    # JWT token expiration time
    # Options: timedelta(hours=24) for 24 hours, timedelta(days=7) for 7 days, etc.
    # Default if not set: 15 minutes
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)  # Change this value as needed
