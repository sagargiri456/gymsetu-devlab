#!/usr/bin/env python3
"""
GymSetu Logo to Favicon Converter
Converts the GymSetu logo image to favicon.ico and multiple PWA icon sizes
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow (PIL) is required. Install it with: pip install Pillow")
    sys.exit(1)


def create_favicon(input_path: str, output_path: str, size: int = 32):
    """Create a favicon.ico file from an input image"""
    try:
        # Open and convert image
        img = Image.open(input_path)

        # Convert to RGBA if not already
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        # Resize to square
        img = img.resize((size, size), Image.Resampling.LANCZOS)

        # Save as ICO
        img.save(output_path, format="ICO", sizes=[(size, size)])
        print(f"✅ Created favicon.ico at {output_path}")
        return True
    except Exception as e:
        print(f"❌ Error creating favicon: {e}")
        return False


def create_pwa_icons(input_path: str, output_dir: str):
    """Create multiple icon sizes for PWA"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]

    try:
        img = Image.open(input_path)

        # Convert to RGBA if not already
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        # Create output directory if it doesn't exist
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        for size in sizes:
            # Resize image
            resized = img.resize((size, size), Image.Resampling.LANCZOS)

            # Save as PNG
            output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
            resized.save(output_path, format="PNG")
            print(f"✅ Created {output_path}")

        return True
    except Exception as e:
        print(f"❌ Error creating PWA icons: {e}")
        return False


def main():
    # Get project root (assuming script is in project root)
    project_root = Path(__file__).parent
    frontend_dir = project_root / "frontend"

    # Default paths
    default_input = frontend_dir / "public" / "images" / "gymsetu-logo.png"
    favicon_output = frontend_dir / "src" / "app" / "favicon.ico"
    icons_output = frontend_dir / "public" / "icons"

    # Get input file path
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
    else:
        input_path = str(default_input)
        print(f"ℹ️  No input file specified, using default: {input_path}")
        print(f"   Usage: python convert_logo_to_favicon.py <path-to-logo-image>")
        print()

    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"❌ Error: Input file not found: {input_path}")
        print("\nPlease:")
        print("1. Save your logo image (PNG or JPG)")
        print("2. Place it in frontend/public/images/gymsetu-logo.png")
        print("3. Run this script again")
        sys.exit(1)

    print("🚀 Converting GymSetu logo to favicon and PWA icons...")
    print(f"📁 Input: {input_path}")
    print()

    # Create favicon
    print("📝 Creating favicon.ico...")
    favicon_dir = favicon_output.parent
    favicon_dir.mkdir(parents=True, exist_ok=True)
    create_favicon(input_path, str(favicon_output), size=32)
    print()

    # Create PWA icons
    print("📝 Creating PWA icons...")
    create_pwa_icons(input_path, str(icons_output))
    print()

    print("✨ Done! Your favicon and icons are ready.")
    print("\nNext steps:")
    print("1. Restart your Next.js dev server")
    print("2. Clear browser cache")
    print("3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)")
    print("4. Check the browser tab for your new favicon!")


if __name__ == "__main__":
    main()
