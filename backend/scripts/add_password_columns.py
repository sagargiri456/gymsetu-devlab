# Script to add password column to member and trainer tables
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
            # Check and add password column to member table
            result = db.session.execute(
                text(
                    """
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='member' AND column_name='password'
            """
                )
            )

            if result.fetchone():
                print("Column password already exists in member table")
            else:
                # Add password column to member table
                db.session.execute(
                    text(
                        """
                    ALTER TABLE member 
                    ADD COLUMN password VARCHAR(100)
                """
                    )
                )
                db.session.commit()
                print("Successfully added password column to member table")

            # Check and add password column to trainer table
            result = db.session.execute(
                text(
                    """
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='trainer' AND column_name='password'
            """
                )
            )

            if result.fetchone():
                print("Column password already exists in trainer table")
            else:
                # Add password column to trainer table
                db.session.execute(
                    text(
                        """
                    ALTER TABLE trainer 
                    ADD COLUMN password VARCHAR(100)
                """
                    )
                )
                db.session.commit()
                print("Successfully added password column to trainer table")

            print("\nMigration completed successfully!")
        except Exception as e:
            print(f"Error: {str(e)}")
            db.session.rollback()
            print("\nPlease run this SQL manually in your database:")
            print("ALTER TABLE member ADD COLUMN password VARCHAR(100);")
            print("ALTER TABLE trainer ADD COLUMN password VARCHAR(100);")
except ImportError as e:
    print(f"Import error: {str(e)}")
    print(
        "\nMake sure your virtual environment is activated and dependencies are installed."
    )
    print("Or run this SQL manually in your database:")
    print("ALTER TABLE member ADD COLUMN password VARCHAR(100);")
    print("ALTER TABLE trainer ADD COLUMN password VARCHAR(100);")
