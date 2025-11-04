# Script to add expiration_date column to member table
# Run this script once to update your database schema
# Make sure your virtual environment is activated before running

import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import create_app
    from database import db
    from sqlalchemy import text

    app = create_app()

    with app.app_context():
        try:
            # Check if column exists first
            result = db.session.execute(
                text(
                    """
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='member' AND column_name='expiration_date'
            """
                )
            )

            if result.fetchone():
                print("Column expiration_date already exists in member table")
            else:
                # Add expiration_date column to member table
                db.session.execute(
                    text(
                        """
                    ALTER TABLE member 
                    ADD COLUMN expiration_date TIMESTAMP
                """
                    )
                )
                db.session.commit()
                print("Successfully added expiration_date column to member table")
        except Exception as e:
            print(f"Error: {str(e)}")
            db.session.rollback()
            print("\nPlease run this SQL manually in your database:")
            print("ALTER TABLE member ADD COLUMN expiration_date TIMESTAMP;")
except ImportError as e:
    print(f"Import error: {str(e)}")
    print(
        "\nMake sure your virtual environment is activated and dependencies are installed."
    )
    print("Or run this SQL manually in your database:")
    print("ALTER TABLE member ADD COLUMN expiration_date TIMESTAMP;")
