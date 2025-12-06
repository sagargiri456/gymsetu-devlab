# Quick Logo Setup Instructions

## Quick Start (3 Steps)

### Step 1: Save Your Logo
1. Save your muscular elephant weightlifting image
2. Name it `gymsetu-logo.png`
3. Place it in: `frontend/public/images/gymsetu-logo.png`

### Step 2: Run the Converter Script
```bash
# Install Pillow if needed
pip install Pillow

# Run the converter (from project root)
python convert_logo_to_favicon.py frontend/public/images/gymsetu-logo.png
```

### Step 3: Restart and Verify
```bash
# Restart your Next.js server
npm run dev

# Then in browser:
# - Clear cache (Ctrl+Shift+Delete)
# - Hard refresh (Ctrl+Shift+R)
# - Check browser tab for favicon
```

## Alternative: Online Tool

If you prefer not to use Python:

1. Go to https://realfavicongenerator.net/
2. Upload your logo image
3. Configure settings:
   - iOS: Use your logo
   - Android: Use your logo
   - Favicon: 32x32
4. Download the package
5. Extract `favicon.ico` to `frontend/src/app/`
6. Extract PNG icons to `frontend/public/icons/`

## File Locations

After setup, you should have:

```
frontend/
├── public/
│   ├── images/
│   │   └── gymsetu-logo.png  ← Your logo here
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
        └── favicon.ico  ← Favicon here
```

## Troubleshooting

**"Pillow not found" error:**
```bash
pip install Pillow
```

**Favicon not showing:**
- Make sure file is exactly named `favicon.ico`
- Clear browser cache completely
- Restart Next.js server
- Try incognito/private browsing mode

**Script can't find image:**
- Check the file path is correct
- Make sure image is PNG or JPG format
- Verify file exists in `frontend/public/images/`

