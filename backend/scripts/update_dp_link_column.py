"""
Migration script to update dp_link columns from VARCHAR(200) to TEXT
This allows storing base64 encoded images which can be much larger than 200 characters.

Run this script to update your database schema:
    python backend/scripts/update_dp_link_column.py
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app import create_app
from database import db


def update_dp_link_columns():
    """Update dp_link columns from VARCHAR(200) to TEXT"""
    app = create_app()

    with app.app_context():
        try:
            # Update member table
            print("Updating member.dp_link column...")
            db.session.execute(
                db.text("ALTER TABLE member ALTER COLUMN dp_link TYPE TEXT")
            )
            print("✓ member.dp_link updated successfully")

            # Update trainer table
            print("Updating trainer.dp_link column...")
            db.session.execute(
                db.text("ALTER TABLE trainer ALTER COLUMN dp_link TYPE TEXT")
            )
            print("✓ trainer.dp_link updated successfully")

            # Commit changes
            db.session.commit()
            print("\n✅ All dp_link columns updated successfully!")
            print("The columns can now store base64 encoded images.")

        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error updating columns: {str(e)}")
            print(
                "\nIf you see 'column does not exist', the column might not be created yet."
            )
            print("If you see 'type does not exist', there might be a syntax issue.")
            raise


if __name__ == "__main__":
    print("=" * 60)
    print("Updating dp_link columns from VARCHAR(200) to TEXT")
    print("=" * 60)
    print()
    update_dp_link_columns()
