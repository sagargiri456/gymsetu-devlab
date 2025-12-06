@echo off
REM GymSetu Logo to Favicon Converter (Windows Batch Script)
REM This script helps convert your logo to favicon using Python

echo ========================================
echo GymSetu Logo to Favicon Converter
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Pillow is installed
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo Pillow is not installed. Installing...
    pip install Pillow
    if errorlevel 1 (
        echo ERROR: Failed to install Pillow
        pause
        exit /b 1
    )
)

REM Check if logo file exists
set LOGO_PATH=frontend\public\images\gymsetu-logo.png
if not exist "%LOGO_PATH%" (
    echo.
    echo ERROR: Logo file not found at: %LOGO_PATH%
    echo.
    echo Please:
    echo 1. Save your logo image as gymsetu-logo.png
    echo 2. Place it in frontend\public\images\
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

REM Run the Python script
echo Converting logo to favicon and PWA icons...
echo.
python convert_logo_to_favicon.py "%LOGO_PATH%"

if errorlevel 1 (
    echo.
    echo ERROR: Conversion failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Conversion complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your Next.js dev server
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Hard refresh (Ctrl+Shift+R)
echo.
pause

