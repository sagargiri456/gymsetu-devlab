-- Fix trainer password column length
-- Run this SQL command in your PostgreSQL database

ALTER TABLE trainer ALTER COLUMN password TYPE VARCHAR(255);

-- Verify the change
SELECT column_name, character_maximum_length 
FROM information_schema.columns 
WHERE table_name='trainer' AND column_name='password';

