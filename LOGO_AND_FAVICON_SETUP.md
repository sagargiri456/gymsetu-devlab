# GymSetu Logo and Favicon Setup Guide

## Overview
This guide will help you set up the GymSetu logo (muscular elephant weightlifting) as both the main logo and favicon for your application.

## Step 1: Save Your Logo Image

1. Save the muscular elephant weightlifting image you have
2. Name it `gymsetu-logo.png` or `gymsetu-logo.jpg`
3. Place it in `frontend/public/images/` directory

**Recommended specifications:**
- Format: PNG (with transparency) or JPG
- Minimum size: 512x512 pixels (square)
- Recommended size: 1024x1024 pixels for best quality

## Step 2: Convert to Favicon

### Option A: Using Online Tools (Easiest)

1. Visit one of these favicon generators:
   - https://favicon.io/favicon-converter/
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/

2. Upload your logo image
3. Download the generated `favicon.ico` file
4. Place it in `frontend/src/app/favicon.ico` (replace existing)

### Option B: Using Python Script (Automated)

I've created a Python script for you. See `convert_logo_to_favicon.py` in the project root.

### Option C: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Install ImageMagick first (if not installed)
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert to favicon
convert frontend/public/images/gymsetu-logo.png -resize 32x32 frontend/src/app/favicon.ico
```

## Step 3: Create Multiple Icon Sizes for PWA

For PWA support, you'll need multiple sizes. Use the same online tools or the Python script to generate:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Place them in `frontend/public/icons/` directory.

## Step 4: Update Logo References (If Needed)

The current logo is referenced at:
- `frontend/public/images/logo.svg` - Main logo file
- Used in: `Sidebar.tsx`, `Topbar.tsx`, and other components

If you want to replace the SVG logo with your PNG image, update the references in those components.

## File Structure After Setup

```
frontend/
├── public/
│   ├── images/
│   │   ├── logo.svg (existing)
│   │   └── gymsetu-logo.png (your new logo)
│   └── icons/
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
└── src/
    └── app/
        └── favicon.ico (your new favicon)
```

## Verification

After setup:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser tab for favicon
4. Check browser DevTools → Application → Manifest for icons

## Troubleshooting

**Favicon not showing:**
- Clear browser cache
- Ensure file is named exactly `favicon.ico`
- Check file is in `frontend/src/app/` directory
- Restart Next.js dev server

**Logo not displaying:**
- Check file path is correct
- Verify image format is supported (PNG, JPG, SVG)
- Check browser console for 404 errors

