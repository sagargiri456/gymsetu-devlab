#!/usr/bin/env python3
"""
Script to generate VAPID keys for web push notifications.
Run this script to generate VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.
"""

import base64


def generate_vapid_keys_cryptography():
    """Generate VAPID keys using cryptography library."""
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.backends import default_backend

    # Generate private key
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())

    # Get public key
    public_key = private_key.public_key()

    # Serialize public key (uncompressed point format for VAPID)
    # VAPID requires the public key in uncompressed point format (65 bytes: 0x04 + 32 bytes X + 32 bytes Y)
    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )

    # Serialize private key (for storage)
    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    # Convert to base64 URL-safe format (standard for VAPID)
    public_key_b64 = (
        base64.urlsafe_b64encode(public_key_bytes).decode("utf-8").rstrip("=")
    )
    private_key_b64 = (
        base64.urlsafe_b64encode(private_key_bytes).decode("utf-8").rstrip("=")
    )

    return public_key_b64, private_key_b64


def main():
    """Main function to generate and display VAPID keys."""
    print("=" * 60)
    print("VAPID Key Generator for Web Push Notifications")
    print("=" * 60)
    print()

    try:
        # Try cryptography library first (most reliable)
        try:
            print("Using cryptography library...")
            public_key, private_key = generate_vapid_keys_cryptography()
        except ImportError:
            # Try py_vapid as fallback
            try:
                print("Trying py_vapid library...")
                from py_vapid import Vapid01
                from cryptography.hazmat.primitives import serialization

                vapid = Vapid01()
                vapid.generate_keys()

                # For VAPID, we need the public key in uncompressed point format
                public_key_bytes = vapid.public_key.public_bytes(
                    encoding=serialization.Encoding.X962,
                    format=serialization.PublicFormat.UncompressedPoint,
                )

                # Serialize private key
                private_key_bytes = vapid.private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption(),
                )

                # Convert to base64 URL-safe (VAPID standard)
                public_key = (
                    base64.urlsafe_b64encode(public_key_bytes)
                    .decode("utf-8")
                    .rstrip("=")
                )
                private_key = (
                    base64.urlsafe_b64encode(private_key_bytes)
                    .decode("utf-8")
                    .rstrip("=")
                )
            except ImportError:
                print("ERROR: Neither cryptography nor py_vapid library is available.")
                print("Please install one of them:")
                print("  pip install cryptography")
                print("  OR")
                print("  pip install py_vapid")
                return

        print()
        print("SUCCESS! VAPID keys generated:")
        print()
        print("-" * 60)
        print("VAPID_PUBLIC_KEY:")
        print("-" * 60)
        print(public_key)
        print()
        print("-" * 60)
        print("VAPID_PRIVATE_KEY:")
        print("-" * 60)
        print(private_key)
        print()
        print("-" * 60)
        print("Add these to your .env file or environment variables:")
        print("-" * 60)
        print(f"VAPID_PUBLIC_KEY={public_key}")
        print(f"VAPID_PRIVATE_KEY={private_key}")
        print(f"VAPID_SUBJECT=mailto:admin@gymsetu.com")
        print()
        print("For frontend (.env.local):")
        print(f"NEXT_PUBLIC_VAPID_PUBLIC_KEY={public_key}")
        print()
        print("=" * 60)

    except Exception as e:
        print(f"ERROR: Failed to generate VAPID keys: {str(e)}")
        import traceback

        traceback.print_exc()
        print()
        print("Please install required dependencies:")
        print("  pip install cryptography")


if __name__ == "__main__":
    main()
