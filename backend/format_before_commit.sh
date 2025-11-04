#!/bin/bash
# Bash script to format Python files before committing
# Run this before git commit to avoid pre-commit hook failures

echo "Running black formatter..."

# Activate virtual environment and run black
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    python -m black .
    if [ $? -eq 0 ]; then
        echo "✓ Files formatted successfully!"
        echo "Now stage the formatted files: git add ."
    else
        echo "✗ Black formatting failed"
        exit 1
    fi
else
    echo "Virtual environment not found. Please run: python -m black ."
fi

