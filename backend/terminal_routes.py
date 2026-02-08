"""
Admin Terminal WebSocket Routes.

Provides a WebSocket endpoint for admins to execute commands
from the browser-based terminal in the admin dashboard.
"""
import base64
import json
import logging
import sqlite3
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.websockets import WebSocketState
from itsdangerous import TimestampSigner, BadSignature
from starlette.requests import HTTPConnection
from sqlalchemy.orm import Session

from database import get_db, SessionLocal
from models import User
from config import DATABASE_PATH, SECRET_KEY

# Session max age in seconds (14 days, matching typical session lifetimes)
SESSION_MAX_AGE = 14 * 24 * 60 * 60

# Logger for terminal operations
logger = logging.getLogger(__name__)

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter()


# ----------------------------
# Terminal Commands
# ----------------------------
HELP_TEXT = """
\x1b[33mAvailable Commands:\x1b[0m

\x1b[36mDatabase Commands:\x1b[0m
  sql <query>       - Execute a SQL query on the SQLite database
  tables            - List all database tables
  schema <table>    - Show schema for a specific table
  
\x1b[36mUser Management:\x1b[0m
  users             - List all users
  promote <user>    - Promote a user to Teacher role
  demote <user>     - Demote a user to Student role
  
\x1b[36mStatistics:\x1b[0m
  stats             - Show database statistics
  
\x1b[36mOther:\x1b[0m
  help              - Show this help message
  clear             - Clear the terminal screen
  
\x1b[33mExamples:\x1b[0m
  sql SELECT * FROM users LIMIT 5
  schema users
  promote johndoe
"""


def format_table(headers: list, rows: list) -> str:
    """Format data as a simple ASCII table."""
    if not rows:
        return "\x1b[33mNo results\x1b[0m"
    
    # Calculate column widths
    widths = [len(str(h)) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(str(cell) if cell is not None else 'NULL'))
    
    # Limit widths for readability
    widths = [min(w, 40) for w in widths]
    
    # Build table
    lines = []
    
    # Header
    header_line = " │ ".join(str(h)[:w].ljust(w) for h, w in zip(headers, widths))
    lines.append(f"\x1b[36m{header_line}\x1b[0m")
    
    # Separator
    sep_line = "─┼─".join("─" * w for w in widths)
    lines.append(sep_line)
    
    # Rows (limit to 50 for display)
    for row in rows[:50]:
        row_str = " │ ".join(
            str(cell if cell is not None else 'NULL')[:w].ljust(w) 
            for cell, w in zip(row, widths)
        )
        lines.append(row_str)
    
    if len(rows) > 50:
        lines.append(f"\x1b[33m... and {len(rows) - 50} more rows\x1b[0m")
    
    return "\r\n".join(lines)


def execute_sql(query: str, username: str = "unknown") -> str:
    """
    Execute a SQL query and return formatted results.
    
    Note: This function allows arbitrary SQL execution for admin users.
    All queries are logged for audit purposes.
    """
    # Log the query for audit purposes
    logger.info(f"SQL query executed by {username}: {query[:100]}{'...' if len(query) > 100 else ''}")
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute(query)
        
        # Check if it's a SELECT or similar query that returns data
        if cursor.description:
            headers = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            result = format_table(headers, rows)
            result += f"\r\n\x1b[32m{len(rows)} row(s) returned\x1b[0m"
        else:
            # For INSERT, UPDATE, DELETE, etc.
            conn.commit()
            affected = cursor.rowcount
            result = f"\x1b[32mQuery executed successfully. {affected} row(s) affected.\x1b[0m"
            logger.info(f"SQL modification by {username}: {affected} row(s) affected")
        
        conn.close()
        return result
        
    except sqlite3.Error as e:
        logger.warning(f"SQL error for {username}: {e}")
        return f"\x1b[31mSQL Error: {e}\x1b[0m"
    except Exception as e:
        return f"\x1b[31mError: {e}\x1b[0m"


def get_tables() -> str:
    """List all tables in the database."""
    return execute_sql("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", "system")


def get_valid_table_names() -> set:
    """Get the set of valid table names from the database."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = {row[0] for row in cursor.fetchall()}
        conn.close()
        return tables
    except sqlite3.Error:
        return set()


def get_schema(table_name: str) -> str:
    """Get the schema for a specific table."""
    # Validate table name: must be an identifier and exist in the database
    if not table_name.isidentifier():
        return "\x1b[31mInvalid table name\x1b[0m"
    
    # Validate against actual existing tables to prevent SQL injection
    valid_tables = get_valid_table_names()
    if table_name not in valid_tables:
        return f"\x1b[31mTable '{table_name}' not found\x1b[0m"
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Get table info
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        if not columns:
            conn.close()
            return f"\x1b[31mTable '{table_name}' not found\x1b[0m"
        
        # Format schema
        lines = [f"\x1b[33mSchema for '{table_name}':\x1b[0m\r\n"]
        headers = ["Column", "Type", "Not Null", "Default", "Primary Key"]
        rows = []
        for col in columns:
            rows.append([
                col[1],  # name
                col[2],  # type
                "YES" if col[3] else "NO",  # notnull
                col[4] if col[4] else "-",  # default
                "YES" if col[5] else "NO"   # pk
            ])
        
        lines.append(format_table(headers, rows))
        
        conn.close()
        return "\r\n".join(lines)
        
    except sqlite3.Error as e:
        return f"\x1b[31mSQL Error: {e}\x1b[0m"


def list_users() -> str:
    """List all users in the database."""
    return execute_sql("SELECT id, username, github_id, role FROM users ORDER BY id")


def promote_user(username: str) -> str:
    """Promote a user to Teacher role."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, role FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return f"\x1b[31mUser '{username}' not found\x1b[0m"
        
        if user[1] == "Teacher":
            conn.close()
            return f"\x1b[33mUser '{username}' is already a Teacher\x1b[0m"
        
        # Promote user
        cursor.execute("UPDATE users SET role = 'Teacher' WHERE username = ?", (username,))
        conn.commit()
        conn.close()
        
        return f"\x1b[32mUser '{username}' has been promoted to Teacher\x1b[0m"
        
    except sqlite3.Error as e:
        return f"\x1b[31mSQL Error: {e}\x1b[0m"


def demote_user(username: str) -> str:
    """Demote a user to Student role."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, role FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return f"\x1b[31mUser '{username}' not found\x1b[0m"
        
        if user[1] == "Student":
            conn.close()
            return f"\x1b[33mUser '{username}' is already a Student\x1b[0m"
        
        # Demote user
        cursor.execute("UPDATE users SET role = 'Student' WHERE username = ?", (username,))
        conn.commit()
        conn.close()
        
        return f"\x1b[32mUser '{username}' has been demoted to Student\x1b[0m"
        
    except sqlite3.Error as e:
        return f"\x1b[31mSQL Error: {e}\x1b[0m"


def get_stats() -> str:
    """Get database statistics."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        stats = []
        
        # Users stats
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Student'")
        students = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Teacher'")
        teachers = cursor.fetchone()[0]
        
        # Scores stats
        cursor.execute("SELECT COUNT(*) FROM scores")
        total_attempts = cursor.fetchone()[0]
        
        cursor.execute("SELECT AVG(score) FROM scores")
        avg_score = cursor.fetchone()[0]
        avg_score = round(avg_score, 2) if avg_score else 0
        
        cursor.execute("SELECT MAX(score) FROM scores")
        max_score = cursor.fetchone()[0] or 0
        
        conn.close()
        
        lines = [
            "\x1b[33m╔═══════════════════════════════════╗\x1b[0m",
            "\x1b[33m║\x1b[0m  \x1b[1mDatabase Statistics\x1b[0m              \x1b[33m║\x1b[0m",
            "\x1b[33m╚═══════════════════════════════════╝\x1b[0m",
            "",
            f"\x1b[36mUsers:\x1b[0m",
            f"  Total Users:    {total_users}",
            f"  Students:       {students}",
            f"  Teachers:       {teachers}",
            "",
            f"\x1b[36mQuiz Statistics:\x1b[0m",
            f"  Total Attempts: {total_attempts}",
            f"  Average Score:  {avg_score}",
            f"  Highest Score:  {max_score}",
        ]
        
        return "\r\n".join(lines)
        
    except sqlite3.Error as e:
        return f"\x1b[31mSQL Error: {e}\x1b[0m"


def process_command(command: str, username: str = "unknown") -> str:
    """Process a terminal command and return the result."""
    command = command.strip()
    
    if not command:
        return ""
    
    # Parse command
    parts = command.split(maxsplit=1)
    cmd = parts[0].lower()
    args = parts[1] if len(parts) > 1 else ""
    
    # Execute command
    if cmd == "help":
        return HELP_TEXT
    elif cmd == "clear":
        return "\x1b[2J\x1b[H"  # ANSI clear screen
    elif cmd == "sql":
        if not args:
            return "\x1b[31mUsage: sql <query>\x1b[0m"
        return execute_sql(args, username)
    elif cmd == "tables":
        return get_tables()
    elif cmd == "schema":
        if not args:
            return "\x1b[31mUsage: schema <table_name>\x1b[0m"
        return get_schema(args)
    elif cmd == "users":
        return list_users()
    elif cmd == "promote":
        if not args:
            return "\x1b[31mUsage: promote <username>\x1b[0m"
        return promote_user(args)
    elif cmd == "demote":
        if not args:
            return "\x1b[31mUsage: demote <username>\x1b[0m"
        return demote_user(args)
    elif cmd == "stats":
        return get_stats()
    else:
        return f"\x1b[31mUnknown command: {cmd}\x1b[0m\r\nType \x1b[33mhelp\x1b[0m for available commands."


# ----------------------------
# Helper: Verify admin access via session cookie
# ----------------------------
async def verify_admin_session(websocket: WebSocket) -> Optional[User]:
    """
    Verify that the WebSocket connection is from an authenticated admin.
    Returns the user if authorized, None otherwise.
    """
    # Get session from cookies
    session_data = websocket.cookies.get("session")
    
    if not session_data:
        return None
    
    try:
        # Decode session - using the same method as Starlette SessionMiddleware
        signer = TimestampSigner(SECRET_KEY)
        # Unsign the cookie data using configured max age
        data = signer.unsign(session_data, max_age=SESSION_MAX_AGE)
        # Decode the base64 JSON data
        session = json.loads(base64.b64decode(data))
        
        github_id = session.get("user_id")
        if not github_id:
            return None
        
        # Get user from database using context manager for proper cleanup
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.github_id == str(github_id)).first()
            if user and user.role in ("Teacher", "Developer"):
                return user
        finally:
            db.close()
        
    except BadSignature as e:
        logger.debug(f"Session signature verification failed: {e}")
    except json.JSONDecodeError as e:
        logger.debug(f"Session JSON decode failed: {e}")
    except Exception as e:
        logger.warning(f"Unexpected error during session verification: {e}")
    
    return None


# ----------------------------
# WebSocket Endpoint
# ----------------------------
@router.websocket("/terminal")
async def terminal_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for the admin terminal.
    Only accessible to users with Teacher or Developer role.
    """
    await websocket.accept()
    
    # Verify admin access
    user = await verify_admin_session(websocket)
    
    if not user:
        await websocket.send_json({
            "error": "Access denied. Teacher or Developer role required."
        })
        await websocket.close(code=4003)
        return
    
    # Log successful connection
    logger.info(f"Admin terminal connected: {user.username} ({user.role})")
    
    # Welcome message
    await websocket.send_json({
        "output": f"Welcome, {user.username}! You have {user.role} access."
    })
    
    try:
        while True:
            # Receive command
            data = await websocket.receive_json()
            command = data.get("command", "")
            
            # Process command with username for audit logging
            result = process_command(command, user.username)
            
            # Send result
            await websocket.send_json({"output": result})
            
    except WebSocketDisconnect:
        logger.info(f"Admin terminal disconnected: {user.username}")
    except Exception as e:
        logger.error(f"Terminal error for {user.username}: {e}")
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({"error": f"Error: {str(e)}"})
