#!/usr/bin/env python3
"""
Quick script to fix the password column length in the member table.
Run this script to update the database schema.

Usage:
    python scripts/fix_password_column.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from app import create_app
    from database import db
    from sqlalchemy import text

    print("=" * 60)
    print("Fixing password column length in member table")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        try:
            # Check current column length
            print("\n1. Checking current password column length...")
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
                print(f"   Current length: {current_length} characters")

                if current_length and current_length < 255:
                    print(
                        f"\n2. Updating password column from VARCHAR({current_length}) to VARCHAR(255)..."
                    )

                    # Update password column length to 255
                    db.session.execute(
                        text(
                            "ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255)"
                        )
                    )
                    db.session.commit()

                    print("   ✓ Successfully updated password column to VARCHAR(255)")
                    print("\n" + "=" * 60)
                    print("✓ Database schema updated successfully!")
                    print("=" * 60)
                else:
                    print(
                        f"\n   ✓ Password column length is already {current_length} (>= 255)"
                    )
                    print("   No update needed.")
            else:
                print("   ⚠ Password column not found in member table")
                print("\n   Please run this SQL manually:")
                print("   ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")

        except Exception as e:
            print(f"\n   ✗ Error: {str(e)}")
            db.session.rollback()
            print("\n   Please run this SQL manually in your database:")
            print("   ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")

except ImportError as e:
    print(f"✗ Import error: {str(e)}")
    print("\nMake sure:")
    print("1. Your virtual environment is activated")
    print("2. You're in the backend directory")
    print("3. All dependencies are installed")
    print("\nTo activate virtual environment:")
    print("  Windows: venv\\Scripts\\activate")
    print("  Linux/Mac: source venv/bin/activate")
    print("\nOr run this SQL manually in your database:")
    print("ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")
