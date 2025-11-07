# Script to update password column length in member table
# Run this script once to update your database schema
# Make sure your virtual environment is activated before running
#
# Usage:
#   cd backend
#   python scripts/update_password_column_length.py
#
# Or run this SQL directly in your database:
#   ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);

import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import create_app
    from database import db
    from sqlalchemy import text

    print("Creating Flask app...")
    app = create_app()

    with app.app_context():
        try:
            print("Checking current password column length...")
            # Check current column type
            result = db.session.execute(
                text(
                    """
                    SELECT character_maximum_length 
                    FROM information_schema.columns 
                    WHERE table_name='member' AND column_name='password'
                """
                )
            )

            current_length = result.fetchone()
            if current_length:
                current_length = current_length[0]
                print(f"Current password column length: {current_length}")

                if current_length and current_length < 255:
                    print("Updating password column length to 255...")
                    # Update password column length to 255
                    db.session.execute(
                        text(
                            """
                            ALTER TABLE member 
                            ALTER COLUMN password TYPE VARCHAR(255)
                        """
                        )
                    )
                    db.session.commit()
                    print(
                        "✓ Successfully updated password column length to 255 characters"
                    )
                else:
                    print(
                        f"✓ Password column length is already {current_length} (>= 255), no update needed"
                    )
            else:
                print("⚠ Password column not found in member table")
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            db.session.rollback()
            print("\nPlease run this SQL manually in your database:")
            print("ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")
except ImportError as e:
    print(f"✗ Import error: {str(e)}")
    print(
        "\nMake sure your virtual environment is activated and dependencies are installed."
    )
    print("\nTo activate virtual environment:")
    print("  Windows: venv\\Scripts\\activate")
    print("  Linux/Mac: source venv/bin/activate")
    print("\nOr run this SQL manually in your database:")
    print("ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")
