import re
from functools import wraps
from flask import request, jsonify
from datetime import datetime


class ValidationError(Exception):
    """Custom exception for validation errors"""

    def __init__(self, message, field=None):
        self.message = message
        self.field = field
        super().__init__(self.message)


def validate_email(email):
    """Validate email format"""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone number format"""
    # Remove all non-digit characters
    digits = re.sub(r"\D", "", phone)
    # Check if it's a valid length (7-15 digits)
    return 7 <= len(digits) <= 15


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number")
    return True


def validate_required_fields(data, required_fields):
    """Validate that all required fields are present"""
    missing_fields = []
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            missing_fields.append(field)

    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")


def validate_string_length(value, field_name, min_length=1, max_length=255):
    """Validate string length"""
    if not isinstance(value, str):
        raise ValidationError(f"{field_name} must be a string")
    if len(value) < min_length:
        raise ValidationError(
            f"{field_name} must be at least {min_length} characters long"
        )
    if len(value) > max_length:
        raise ValidationError(
            f"{field_name} must be no more than {max_length} characters long"
        )


def validate_numeric(value, field_name, min_value=None, max_value=None):
    """Validate numeric values"""
    try:
        num_value = float(value)
        if min_value is not None and num_value < min_value:
            raise ValidationError(f"{field_name} must be at least {min_value}")
        if max_value is not None and num_value > max_value:
            raise ValidationError(f"{field_name} must be no more than {max_value}")
        return num_value
    except (ValueError, TypeError):
        raise ValidationError(f"{field_name} must be a valid number")


def validate_date_format(date_string, field_name):
    """Validate date format (YYYY-MM-DD)"""
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
        return True
    except ValueError:
        raise ValidationError(f"{field_name} must be in YYYY-MM-DD format")


def validate_json_request(f):
    """Decorator to validate that request contains valid JSON"""

    @wraps(f)  # wrap ka matlab hai ki ye function ko wrap karke return karega
    # actually decorator jab v python execute karta hai to wo name change kar deta hai function ka
    # and for example function hai register to wo register ka naam change kar deta hai to wraps
    # is se execution me koi dikkat nhi aati par kavi error aa jaye to python kehta hai ki wraps me
    # error aayi hai lekin wrap to user ne likha hin nhi that developer ne to register likha that
    # isi problem ko solve karta hai apna wraps(f) function ye jab error aata hai to original function ka naam use karta hai

    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        try:
            data = request.get_json()
            if data is None:
                return jsonify({"error": "Request body cannot be empty"}), 400
        except Exception as e:
            return jsonify({"error": "Invalid JSON format"}), 400

        return f(*args, **kwargs)

    return decorated_function


def validate_gym_registration(data):
    """Validate gym registration data"""
    required_fields = [
        "name",
        "address",
        "city",
        "state",
        "zip",
        "phone",
        "email",
        "password",
    ]
    validate_required_fields(data, required_fields)

    # Validate email
    if not validate_email(data["email"]):
        raise ValidationError("Invalid email format")

    # Validate phone
    if not validate_phone(data["phone"]):
        raise ValidationError("Invalid phone number format")

    # Validate password
    validate_password(data["password"])

    # Validate string lengths
    validate_string_length(data["name"], "Name", 2, 100)
    validate_string_length(data["address"], "Address", 5, 200)
    validate_string_length(data["city"], "City", 2, 50)
    validate_string_length(data["state"], "State", 2, 50)
    validate_string_length(data["zip"], "ZIP code", 5, 10)


def validate_member_data(data):
    """Validate member data (for creating new members - all fields required)"""
    required_fields = ["name", "email", "phone", "address", "city", "state", "zip"]
    validate_required_fields(data, required_fields)

    # Validate email
    if not validate_email(data["email"]):
        raise ValidationError("Invalid email format")

    # Validate phone
    if not validate_phone(data["phone"]):
        raise ValidationError("Invalid phone number format")

    # Validate string lengths
    validate_string_length(data["name"], "Name", 2, 100)
    validate_string_length(data["address"], "Address", 5, 200)
    validate_string_length(data["city"], "City", 2, 50)
    validate_string_length(data["state"], "State", 2, 50)
    validate_string_length(data["zip"], "ZIP code", 5, 10)


def validate_member_update_data(data):
    """Validate member update data (for partial updates - only validate fields that are provided)"""
    # Only validate fields that are present in the data
    if "email" in data:
        if not validate_email(data["email"]):
            raise ValidationError("Invalid email format")

    if "phone" in data:
        if not validate_phone(data["phone"]):
            raise ValidationError("Invalid phone number format")

    if "name" in data:
        validate_string_length(data["name"], "Name", 2, 100)

    if "address" in data:
        validate_string_length(data["address"], "Address", 5, 200)

    if "city" in data:
        validate_string_length(data["city"], "City", 2, 50)

    if "state" in data:
        validate_string_length(data["state"], "State", 2, 50)

    if "zip" in data:
        validate_string_length(data["zip"], "ZIP code", 5, 10)

    if "expiration_date" in data:
        validate_date_format(data["expiration_date"], "Expiration date")


def validate_subscription_plan_data(data):
    """Validate subscription plan data"""
    required_fields = ["name", "description", "price", "duration"]
    validate_required_fields(data, required_fields)

    # Validate string lengths
    validate_string_length(data["name"], "Name", 2, 100)
    validate_string_length(data["description"], "Description", 10, 500)

    # Validate numeric values
    validate_numeric(data["price"], "Price", 0)
    validate_numeric(data["duration"], "Duration", 1)


def validate_subscription_data(data):
    """Validate subscription data"""
    required_fields = [
        "member_id",
        "subscription_plan",
        "subscription_status",
        "start_date",
        "end_date",
    ]
    validate_required_fields(data, required_fields)

    # Validate dates
    validate_date_format(data["start_date"], "Start date")
    validate_date_format(data["end_date"], "End date")

    # Validate subscription status
    valid_statuses = ["active", "inactive", "expired", "cancelled"]
    if data["subscription_status"] not in valid_statuses:
        raise ValidationError(
            f"Subscription status must be one of: {', '.join(valid_statuses)}"
        )

    # Validate member_id is numeric
    validate_numeric(data["member_id"], "Member ID", 1)


def validate_login_data(data):
    """Validate login data"""
    required_fields = ["email", "password"]
    validate_required_fields(data, required_fields)

    # Validate email
    if not validate_email(data["email"]):
        raise ValidationError("Invalid email format")

    # Validate password is not empty
    if not data["password"] or len(data["password"]) < 1:
        raise ValidationError("Password cannot be empty")


def validate_password_reset_data(data):
    """Validate password reset data"""
    required_fields = ["email", "otp", "password"]
    validate_required_fields(data, required_fields)

    # Validate email
    if not validate_email(data["email"]):
        raise ValidationError("Invalid email format")

    # Validate OTP format (6 digits)
    if not re.match(r"^\d{6}$", data["otp"]):
        raise ValidationError("OTP must be 6 digits")

    # Validate new password
    validate_password(data["password"])


def validate_change_password_data(data):
    """Validate change password data"""
    required_fields = ["email", "old_password", "new_password"]
    validate_required_fields(data, required_fields)

    # Validate email
    if not validate_email(data["email"]):
        raise ValidationError("Invalid email format")

    # Validate new password
    validate_password(data["new_password"])

    # Ensure old and new passwords are different
    if data["old_password"] == data["new_password"]:
        raise ValidationError("New password must be different from old password")
