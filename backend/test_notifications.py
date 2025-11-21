#!/usr/bin/env python3
"""
Test script to manually trigger expired membership check and verify notifications.
Run this script to test the notification system without waiting for the scheduler.
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from services.notification_service import check_expired_memberships
from models.members import Member
from models.notification import Notification
from database import db
from datetime import date, datetime, timedelta

app = create_app()

with app.app_context():
    print("=" * 60)
    print("Testing Expired Membership Notification System")
    print("=" * 60)
    print()

    # 1. Check current members and their expiration dates
    print("1. Checking all members and their expiration dates:")
    print("-" * 60)
    all_members = Member.query.filter_by(is_active=True).all()
    print(f"Total active members: {len(all_members)}")
    print()

    for member in all_members:
        exp_date = (
            member.expiration_date.strftime("%Y-%m-%d")
            if member.expiration_date
            else "Not set"
        )
        is_expired = (
            member.expiration_date and member.expiration_date.date() < date.today()
        )
        status = "EXPIRED" if is_expired else "ACTIVE"
        print(f"  - {member.name} (ID: {member.id}): Expiration: {exp_date} [{status}]")

    print()

    # 2. Check existing notifications
    print("2. Checking existing notifications:")
    print("-" * 60)
    all_notifications = Notification.query.all()
    print(f"Total notifications in database: {len(all_notifications)}")
    for notif in all_notifications:
        print(
            f"  - {notif.title}: {notif.message[:50]}... (Created: {notif.created_at})"
        )
    print()

    # 3. Run the expired membership check
    print("3. Running expired membership check:")
    print("-" * 60)
    result = check_expired_memberships()
    print(f"Result: {result}")
    print()

    # 4. Check notifications after the check
    print("4. Checking notifications after the check:")
    print("-" * 60)
    notifications_after = Notification.query.all()
    print(f"Total notifications now: {len(notifications_after)}")
    if len(notifications_after) > len(all_notifications):
        print(
            f"  ✓ Created {len(notifications_after) - len(all_notifications)} new notification(s)"
        )
        for notif in notifications_after[len(all_notifications) :]:
            print(f"    - {notif.title}: {notif.message[:50]}...")
    else:
        print("  ℹ No new notifications created")
        print("  Possible reasons:")
        print("    - No members have expiration_date set")
        print("    - No members have expiration_date in the past")
        print("    - Notifications already exist for expired members today")
    print()

    # 5. Show how to create a test member
    print("5. To test with a member that has expired subscription:")
    print("-" * 60)
    print("  Option 1: Update an existing member's expiration_date to yesterday:")
    print(
        "    UPDATE member SET expiration_date = CURRENT_DATE - INTERVAL '1 day' WHERE id = <member_id>;"
    )
    print()
    print("  Option 2: Use the extend subscription feature to set a past date")
    print("  Option 3: Create a new member with expiration_date in the past")
    print()
    print("=" * 60)
