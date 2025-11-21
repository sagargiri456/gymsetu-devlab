from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import logging
import os
from services.notification_service import check_expired_memberships

# Try to import requests, but don't fail if it's not available
try:
    import requests

    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

logger = logging.getLogger(__name__)

scheduler = None


def init_scheduler(app):
    """
    Initialize the APScheduler to run daily checks.
    """
    global scheduler

    if scheduler is not None:
        logger.warning("Scheduler already initialized")
        return scheduler

    scheduler = BackgroundScheduler()
    scheduler.start()

    # Get check time from environment or use default (00:00)
    check_time = os.getenv("DAILY_CHECK_TIME", "00:00")
    hour, minute = map(int, check_time.split(":"))

    # Schedule daily check
    scheduler.add_job(
        func=run_daily_check,
        trigger=CronTrigger(hour=hour, minute=minute),
        id="daily_expiration_check",
        name="Daily Member Expiration Check",
        replace_existing=True,
    )

    # Schedule keep-alive and membership check every 14 minutes
    # This prevents Render from spinning down the server after 15 minutes of inactivity
    scheduler.add_job(
        func=run_keep_alive_and_check,
        trigger=IntervalTrigger(minutes=14),
        id="keep_alive_and_membership_check",
        name="Keep Alive and Membership Check",
        replace_existing=True,
    )

    logger.info(f"Scheduler initialized. Daily check scheduled for {check_time} UTC")
    logger.info("Keep-alive job scheduled to run every 14 minutes")

    # Also add a job to run immediately on startup (for testing)
    # Comment this out in production if you only want it to run at scheduled time
    # scheduler.add_job(
    #     func=run_daily_check,
    #     trigger='date',
    #     run_date=datetime.now() + timedelta(seconds=10),
    #     id='initial_check',
    #     name='Initial Expiration Check'
    # )

    return scheduler


def run_daily_check():
    """
    Wrapper function to run the daily check with app context.
    """
    from flask import current_app

    with current_app.app_context():
        logger.info("Running daily expiration check...")
        result = check_expired_memberships()
        logger.info(f"Daily check completed: {result}")


def run_keep_alive_and_check():
    """
    Function that runs every 14 minutes to:
    1. Ping the server's health endpoint to keep it alive (external HTTP request for Render)
    2. Check for expired memberships and notify if any
    """
    from flask import current_app

    with current_app.app_context():
        try:
            # Try to make an external HTTP request first (for Render to see traffic)
            # This is what actually keeps the server alive on Render
            server_url = os.getenv("RENDER_EXTERNAL_URL") or os.getenv("SERVER_URL")

            if server_url and REQUESTS_AVAILABLE:
                # Remove trailing slash if present
                server_url = server_url.rstrip("/")
                health_url = f"{server_url}/health"

                logger.info(f"Running keep-alive check: pinging {health_url}")

                try:
                    response = requests.get(health_url, timeout=10)
                    if response.status_code == 200:
                        logger.info(
                            "Server health check successful - server kept alive"
                        )
                    else:
                        logger.warning(
                            f"Health check returned status {response.status_code}"
                        )
                except Exception as e:
                    logger.warning(f"Failed to ping external health endpoint: {str(e)}")
                    # Fall back to internal test client
                    _ping_internal_health(current_app)
            else:
                # Use internal test client if external URL not available or requests not installed
                logger.info(
                    "Running keep-alive check: pinging /health endpoint (internal)"
                )
                _ping_internal_health(current_app)

            # Check for expired memberships
            logger.info("Checking for expired memberships...")
            result = check_expired_memberships()

            if result.get("success"):
                expired_count = result.get("expired_count", 0)
                notifications_created = result.get("notifications_created", 0)
                if expired_count > 0:
                    logger.info(
                        f"Found {expired_count} expired memberships, "
                        f"created {notifications_created} notifications"
                    )
                else:
                    logger.info("No expired memberships found")
            else:
                logger.error(
                    f"Error checking expired memberships: {result.get('error')}"
                )

        except Exception as e:
            logger.error(f"Error in keep-alive and membership check: {str(e)}")


def _ping_internal_health(app):
    """
    Helper function to ping health endpoint using Flask's test client.
    """
    try:
        with app.test_client() as client:
            response = client.get("/health")
            if response.status_code == 200:
                logger.info("Internal health check successful")
            else:
                logger.warning(
                    f"Internal health check returned status {response.status_code}"
                )
    except Exception as e:
        logger.error(f"Failed to ping internal health endpoint: {str(e)}")


def shutdown_scheduler():
    """
    Shutdown the scheduler gracefully.
    """
    global scheduler
    if scheduler:
        scheduler.shutdown()
        logger.info("Scheduler shut down")
