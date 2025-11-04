# Git Commit Workflow - Fixing Black Pre-commit Hook

## The Problem
Every time you commit, the `black` formatter runs and reformats your Python files. If files are reformatted, the commit fails because the reformatted files aren't automatically staged.

## Solutions

### ✅ Solution 1: Format Before Committing (Recommended)

**On Windows (PowerShell):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m black .
git add .
git commit -m "Your commit message"
```

**Or use the helper script:**
```powershell
cd backend
.\format_before_commit.ps1
git add .
git commit -m "Your commit message"
```

**On Mac/Linux:**
```bash
cd backend
source venv/bin/activate
python -m black .
git add .
git commit -m "Your commit message"
```

### ✅ Solution 2: Two-Step Commit (Quick Fix)

If you forget to format first, just do this:

1. **When commit fails** (black reformatted files):
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
   Just re-add the formatted files and commit again!

### ✅ Solution 3: Skip Hook Temporarily (Not Recommended)

Only use this if you're in a hurry:
```bash
git commit -m "Your message" --no-verify
```

⚠️ **Warning:** This skips all pre-commit checks, including formatting.

## Quick Reference

**Normal workflow:**
```bash
# 1. Make your changes
# 2. Format files
cd backend && python -m black . && cd ..

# 3. Stage and commit
git add .
git commit -m "Your message"
git push
```

**If commit fails due to black:**
```bash
# Just re-add and commit
git add .
git commit -m "Your message"
```

## Why This Happens

The pre-commit hook runs `black` to ensure all code is consistently formatted. This is a **good thing** - it keeps your codebase clean! The "error" is just black reformatting files that weren't formatted correctly.

## Pro Tip

Create a git alias to make this easier:
```bash
git config --global alias.ci "!f() { cd backend && python -m black . && cd .. && git add . && git commit \"$@\"; }; f"
```

Then you can just use:
```bash
git ci -m "Your message"
```

