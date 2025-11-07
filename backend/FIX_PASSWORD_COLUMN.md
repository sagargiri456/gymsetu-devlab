# Fix Password Column Length

## Problem
The password column in the `member` table is `VARCHAR(100)` but password hashes are 143 characters long, causing database errors.

## Solution

### Option 1: Run SQL Directly (Fastest)

Connect to your PostgreSQL database and run:

```sql
ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);
```

### Option 2: Run the Migration Script

1. **Activate your virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Run the script:**
   ```bash
   cd backend
   python scripts/fix_password_column.py
   ```

### Option 3: Using psql Command Line

If you have PostgreSQL installed and know your database connection details:

```bash
psql -U your_username -d your_database_name -c "ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);"
```

### Option 4: Using Python with psycopg2

If you have psycopg2 installed:

```python
import psycopg2
from config import get_database_url

# Parse database URL
db_url = get_database_url()
conn = psycopg2.connect(db_url)
cur = conn.cursor()

# Update column
cur.execute("ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")
conn.commit()

print("✓ Password column updated successfully!")

cur.close()
conn.close()
```

## Verify the Fix

After running the migration, verify the column was updated:

```sql
SELECT column_name, character_maximum_length 
FROM information_schema.columns 
WHERE table_name='member' AND column_name='password';
```

You should see `character_maximum_length = 255`.

## After Fixing

Once the column is updated, try the member password setup again. The error should be resolved.

