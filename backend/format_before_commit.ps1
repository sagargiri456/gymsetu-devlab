# PowerShell script to format Python files before committing
# Run this before git commit to avoid pre-commit hook failures

Write-Host "Running black formatter..." -ForegroundColor Cyan

# Activate virtual environment and run black
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\python.exe" -m black .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Files formatted successfully!" -ForegroundColor Green
        Write-Host "Now stage the formatted files: git add ." -ForegroundColor Yellow
    } else {
        Write-Host "✗ Black formatting failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Virtual environment not found. Please run: python -m black ." -ForegroundColor Yellow
}

