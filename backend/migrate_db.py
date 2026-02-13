#!/usr/bin/env python3
"""
Database migration script to add the correct_questions column to the scores table.
This migration is needed for users upgrading from before PR #15.

Run this script after pulling updates to migrate your existing database.
Usage: python migrate_db.py
"""
import sqlite3
import sys
from pathlib import Path

from config import DATABASE_PATH


def migrate_database():
    """Add correct_questions column to scores table if it doesn't exist."""
    db_path = Path(DATABASE_PATH)
    
    if not db_path.exists():
        print(f"Database file not found at: {db_path}")
        print("No migration needed - database will be created with correct schema on first run.")
        return True
    
    print(f"Migrating database at: {db_path}")
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if correct_questions column exists
        cursor.execute("PRAGMA table_info(scores)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if "correct_questions" in columns:
            print("✓ Database is already up to date - correct_questions column exists")
            conn.close()
            return True
        
        print("Adding correct_questions column to scores table...")
        
        # Add the new column with default value
        cursor.execute("""
            ALTER TABLE scores 
            ADD COLUMN correct_questions TEXT DEFAULT '[]'
        """)
        
        conn.commit()
        print("✓ Migration successful - correct_questions column added")
        
        # Verify the change
        cursor.execute("PRAGMA table_info(scores)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if "correct_questions" not in columns:
            print("✗ Migration verification failed!")
            conn.close()
            return False
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"✗ Migration failed: {e}")
        return False


if __name__ == "__main__":
    print("Quiz App Database Migration")
    print("=" * 50)
    
    success = migrate_database()
    
    if success:
        print("\nMigration complete!")
        sys.exit(0)
    else:
        print("\nMigration failed!")
        sys.exit(1)
