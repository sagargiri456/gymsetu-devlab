import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()


def send_email(to_email, subject, body):
    """
    Send an email using SMTP

    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        body (str): Email body content

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Email configuration from environment variables
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        sender_email = os.getenv("SENDER_EMAIL")
        sender_password = os.getenv("SENDER_PASSWORD")

        if not sender_email or not sender_password:
            print(
                "Warning: Email credentials not configured. Please set SENDER_EMAIL and SENDER_PASSWORD in your .env file"
            )
            return False

        # Create message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = to_email
        msg["Subject"] = subject

        # Add body to email
        msg.attach(MIMEText(body, "plain"))

        # Create SMTP session
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Enable security
        server.login(sender_email, sender_password)

        # Send email
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()

        print(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def send_password_reset_email(to_email, otp):
    """
    Send password reset email with OTP

    Args:
        to_email (str): Recipient email address
        otp (str): One-time password for reset

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    subject = "Password Reset - GymSetu"
    body = f"""
    Hello,
    
    You have requested to reset your password for your GymSetu account.
    
    Your OTP (One-Time Password) is: {otp}
    
    Please use this OTP to reset your password. This OTP is valid for 10 minutes.
    
    If you did not request this password reset, please ignore this email.
    
    Best regards,
    GymSetu Team
    """

    return send_email(to_email, subject, body)


def send_subscription_plan_email(
    to_email, subscription_plan, start_date, end_date, subscription_status, sender_email
):
    """
    Send subscription plan email

    Args:
        to_email (str): Recipient email address
        subscription_plan (str): Subscription plan name
        start_date (str): Subscription start date
        end_date (str): Subscription end date
        subscription_status (str): Subscription status
        sender_email (str): Sender email address
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    subject = "Subscription Plan - GymSetu"
    body = f"""
    Hello,
    
    You have subscribed to the following subscription plan: {subscription_plan}
    your subscription will start from {start_date} and will end on {end_date}
    your subscription status is {subscription_status}

    If you have any questions, please contact us at {sender_email}
    Best regards,
    GymSetu Team
    """
    return send_email(to_email, subject, body)


def send_subscription_plan_expiry_email(
    to_email, subscription_plan, start_date, end_date, subscription_status, sender_email
):
    """
    Send subscription plan expiry email

    Args:
        to_email (str): Recipient email address
        subscription_plan (str): Subscription plan name
        start_date (str): Subscription start date
        end_date (str): Subscription end date
        subscription_status (str): Subscription status
        sender_email (str): Sender email address
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    subject = "Subscription Plan Expiry - GymSetu"
    body = f"""
    Hello,
    
    Your subscription plan {subscription_plan} will expire on {end_date}
    your subscription status is {subscription_status}
    If you have any questions, please contact us at {sender_email}
    Best regards,
    GymSetu Team
    """
