# Script to add all missing columns to member and trainer tables
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
            # Member table columns to check/add
            member_columns = [
                ("password", "VARCHAR(100)"),
                ("gender", "VARCHAR(100)"),
                ("dob", "TIMESTAMP"),
                ("weight", "FLOAT"),
                ("height", "FLOAT"),
                ("is_active", "BOOLEAN DEFAULT TRUE"),
                ("expiration_date", "TIMESTAMP"),
            ]

            print("Checking member table columns...")
            for column_name, column_type in member_columns:
                result = db.session.execute(
                    text(
                        """
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='member' AND column_name=:col_name
                """
                    ),
                    {"col_name": column_name},
                )

                if result.fetchone():
                    print(f"  ✓ Column '{column_name}' already exists in member table")
                else:
                    db.session.execute(
                        text(
                            f"""
                        ALTER TABLE member 
                        ADD COLUMN {column_name} {column_type}
                    """
                        )
                    )
                    db.session.commit()
                    print(
                        f"  ✓ Successfully added column '{column_name}' to member table"
                    )

            # Trainer table columns to check/add
            trainer_columns = [
                ("password", "VARCHAR(100)"),
                ("gender", "VARCHAR(100)"),
                ("dob", "TIMESTAMP"),
                ("weight", "FLOAT"),
                ("height", "FLOAT"),
                ("is_active", "BOOLEAN DEFAULT TRUE"),
                ("experience", "INTEGER"),
                ("specialization", "VARCHAR(100)"),
                ("certifications", "VARCHAR(100)"),
                ("availability", "VARCHAR(100)"),
                ("location", "VARCHAR(100)"),
                ("bio", "VARCHAR(100)"),
                ("skills", "VARCHAR(100)"),
                ("languages", "VARCHAR(100)"),
                ("dp_link", "VARCHAR(200)"),
            ]

            print("\nChecking trainer table columns...")
            for column_name, column_type in trainer_columns:
                result = db.session.execute(
                    text(
                        """
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='trainer' AND column_name=:col_name
                """
                    ),
                    {"col_name": column_name},
                )

                if result.fetchone():
                    print(f"  ✓ Column '{column_name}' already exists in trainer table")
                else:
                    db.session.execute(
                        text(
                            f"""
                        ALTER TABLE trainer 
                        ADD COLUMN {column_name} {column_type}
                    """
                        )
                    )
                    db.session.commit()
                    print(
                        f"  ✓ Successfully added column '{column_name}' to trainer table"
                    )

            print("\n✓ Migration completed successfully!")
        except Exception as e:
            print(f"\n✗ Error: {str(e)}")
            db.session.rollback()
            print("\nPlease run the SQL manually in your database:")
            print("\n-- Member table:")
            for col_name, col_type in member_columns:
                print(
                    f"ALTER TABLE member ADD COLUMN IF NOT EXISTS {col_name} {col_type};"
                )
            print("\n-- Trainer table:")
            for col_name, col_type in trainer_columns:
                print(
                    f"ALTER TABLE trainer ADD COLUMN IF NOT EXISTS {col_name} {col_type};"
                )
except ImportError as e:
    print(f"Import error: {str(e)}")
    print(
        "\nMake sure your virtual environment is activated and dependencies are installed."
    )
