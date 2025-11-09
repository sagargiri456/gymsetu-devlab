# Fix Password Column Length

## Problem
The password column in the `member` and `trainer` tables is `VARCHAR(100)` but password hashes are 143 characters long, causing database errors.

## Solution

### Option 1: Run SQL Directly (Fastest)

Connect to your PostgreSQL database and run:

**For Member table:**
```sql
ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);
```

**For Trainer table:**
```sql
ALTER TABLE trainer ALTER COLUMN password TYPE VARCHAR(255);
```

**Or both at once:**
```sql
ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);
ALTER TABLE trainer ALTER COLUMN password TYPE VARCHAR(255);
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
   # For member table
   python scripts/fix_password_column.py
   # For trainer table
   python scripts/fix_trainer_password_column.py
   ```

### Option 3: Using psql Command Line

If you have PostgreSQL installed and know your database connection details:

```bash
# For member table
psql -U your_username -d your_database_name -c "ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);"

# For trainer table
psql -U your_username -d your_database_name -c "ALTER TABLE trainer ALTER COLUMN password TYPE VARCHAR(255);"
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

# Update columns
cur.execute("ALTER TABLE member ALTER COLUMN password TYPE VARCHAR(255);")
cur.execute("ALTER TABLE trainer ALTER COLUMN password TYPE VARCHAR(255);")
conn.commit()

print("✓ Password columns updated successfully!")

cur.close()
conn.close()
```

## Verify the Fix

After running the migration, verify the columns were updated:

**For Member table:**
```sql
SELECT column_name, character_maximum_length 
FROM information_schema.columns 
WHERE table_name='member' AND column_name='password';
```

**For Trainer table:**
```sql
SELECT column_name, character_maximum_length 
FROM information_schema.columns 
WHERE table_name='trainer' AND column_name='password';
```

**Or check both at once:**
```sql
SELECT table_name, column_name, character_maximum_length 
FROM information_schema.columns 
WHERE table_name IN ('member', 'trainer') AND column_name='password';
```

You should see `character_maximum_length = 255` for both tables.

## After Fixing

Once the columns are updated, try the member or trainer password setup again. The error should be resolved.

