"""
Cloudinary utility functions for image uploads
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,  # Use HTTPS
)


def upload_member_photo(file, member_id=None, gym_id=None):
    """
    Upload a member photo to Cloudinary

    Args:
        file: File object from Flask request
        member_id: Optional member ID for folder organization
        gym_id: Optional gym ID for folder organization

    Returns:
        dict: Contains 'url' (secure URL) and 'public_id' (Cloudinary public ID)
        None: If upload fails
    """
    try:
        # Build folder path for organization
        folder_parts = ["gymsetu", "members"]
        if gym_id:
            folder_parts.append(f"gym_{gym_id}")
        folder_path = "/".join(folder_parts)

        # Generate unique filename
        filename = f"member_{member_id}" if member_id else "member"

        # Upload to Cloudinary with optimizations
        result = cloudinary.uploader.upload(
            file,
            folder=folder_path,
            public_id=filename,
            transformation=[
                {
                    "width": 400,
                    "height": 400,
                    "crop": "fill",
                    "gravity": "face",  # Focus on faces if detected
                    "quality": "auto",  # Automatic quality optimization
                    "format": "auto",  # Auto format (WebP when supported)
                }
            ],
            resource_type="image",
            overwrite=True,  # Overwrite if same public_id exists
        )

        logger.info(
            f"Successfully uploaded image to Cloudinary: {result['secure_url']}"
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result.get("format", "jpg"),
            "bytes": result.get("bytes", 0),
        }

    except Exception as e:
        logger.error(f"Error uploading image to Cloudinary: {str(e)}")
        return None


def upload_trainer_photo(file, trainer_id=None, gym_id=None):
    """
    Upload a trainer photo to Cloudinary

    Args:
        file: File object from Flask request
        trainer_id: Optional trainer ID for folder organization
        gym_id: Optional gym ID for folder organization

    Returns:
        dict: Contains 'url' (secure URL) and 'public_id' (Cloudinary public ID)
        None: If upload fails
    """
    try:
        # Build folder path for organization
        folder_parts = ["gymsetu", "trainers"]
        if gym_id:
            folder_parts.append(f"gym_{gym_id}")
        folder_path = "/".join(folder_parts)

        # Generate unique filename
        filename = f"trainer_{trainer_id}" if trainer_id else "trainer"

        # Upload to Cloudinary with optimizations
        result = cloudinary.uploader.upload(
            file,
            folder=folder_path,
            public_id=filename,
            transformation=[
                {
                    "width": 400,
                    "height": 400,
                    "crop": "fill",
                    "gravity": "face",
                    "quality": "auto",
                    "format": "auto",
                }
            ],
            resource_type="image",
            overwrite=True,
        )

        logger.info(
            f"Successfully uploaded trainer image to Cloudinary: {result['secure_url']}"
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result.get("format", "jpg"),
            "bytes": result.get("bytes", 0),
        }

    except Exception as e:
        logger.error(f"Error uploading trainer image to Cloudinary: {str(e)}")
        return None


def delete_image(public_id):
    """
    Delete an image from Cloudinary

    Args:
        public_id: Cloudinary public ID of the image to delete

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") == "ok":
            logger.info(f"Successfully deleted image from Cloudinary: {public_id}")
            return True
        else:
            logger.warning(f"Failed to delete image from Cloudinary: {result}")
            return False
    except Exception as e:
        logger.error(f"Error deleting image from Cloudinary: {str(e)}")
        return False


def validate_image_file(file):
    """
    Validate that the uploaded file is an image

    Args:
        file: File object from Flask request

    Returns:
        tuple: (is_valid: bool, error_message: str)
    """
    if not file:
        return False, "No file provided"

    # Check file extension
    allowed_extensions = {"png", "jpg", "jpeg", "gif", "webp"}
    filename = file.filename.lower() if hasattr(file, "filename") else ""

    if filename:
        file_ext = filename.rsplit(".", 1)[1] if "." in filename else ""
        if file_ext not in allowed_extensions:
            return False, f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"

    # Check file size (max 10MB)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)  # Reset file pointer

    max_size = 10 * 1024 * 1024  # 10MB
    if file_size > max_size:
        return False, f"File too large. Maximum size: 10MB"

    return True, ""
