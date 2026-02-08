# Admin Terminal Documentation

The Admin Terminal is a browser-based command-line interface available to Teachers and Developers on the Admin Dashboard. It provides direct access to database management and administrative functions.

## Accessing the Terminal

1. Log in with a GitHub account that has **Teacher** or **Developer** role
2. Navigate to the **Admin Dashboard** (`/admin`)
3. The terminal appears at the bottom of the page (minimized by default)
4. Click the **▲** button to expand the terminal

## Connection Status

The terminal header shows a connection status indicator:
- 🟢 **Green dot**: Connected to server
- 🔴 **Red dot**: Disconnected

If disconnected, click the **↻ Reconnect** button.

---

## Available Commands

### Database Commands

| Command | Description |
|---------|-------------|
| `sql <query>` | Execute a SQL query on the SQLite database |
| `tables` | List all database tables |
| `schema <table>` | Show the schema for a specific table |

### User Management

| Command | Description |
|---------|-------------|
| `users` | List all registered users |
| `promote <username>` | Promote a user to Teacher role |
| `demote <username>` | Demote a user to Student role |

### Other Commands

| Command | Description |
|---------|-------------|
| `stats` | Show database statistics |
| `help` | Show the help message with all commands |
| `clear` | Clear the terminal screen |

---

## SQL Command Examples

### Viewing Data

```sql
-- View all users
sql SELECT * FROM users

-- View users with specific columns
sql SELECT username, role FROM users ORDER BY username

-- Filter by role
sql SELECT * FROM users WHERE role = 'Teacher'

-- View quiz history
sql SELECT * FROM scores ORDER BY timestamp DESC LIMIT 10
```

### Modifying User Roles

```sql
-- Promote a user to Teacher
sql UPDATE users SET role = 'Teacher' WHERE username = 'johndoe'

-- Demote a user to Student
sql UPDATE users SET role = 'Student' WHERE username = 'janedoe'

-- Set Developer role
sql UPDATE users SET role = 'Developer' WHERE username = 'admin'
```

### Managing Quiz Scores

```sql
-- Delete scores for a specific user
sql DELETE FROM scores WHERE user_id = 1

-- Delete scores for a specific quiz
sql DELETE FROM scores WHERE quiz_id = 'python-basics'

-- Delete low scores
sql DELETE FROM scores WHERE score < 50
```

### Advanced Queries

```sql
-- Count quiz attempts per user
sql SELECT username, COUNT(*) as attempts FROM scores s JOIN users u ON s.user_id = u.id GROUP BY username

-- Calculate average score per quiz
sql SELECT quiz_id, AVG(score) as avg_score FROM scores GROUP BY quiz_id

-- Search for users
sql SELECT * FROM users WHERE username LIKE '%test%'
```

---

## Security Notes

⚠️ **Warning**: SQL modifications are permanent!

- All SQL queries are logged for audit purposes
- Only Teachers and Developers can access the terminal
- The terminal uses WebSocket with session authentication
- Always verify your queries before executing DELETE or UPDATE commands

---

## Technical Details

### Architecture

- **Frontend**: `AdminTerminal.js` component using xterm.js
- **Backend**: `terminal_routes.py` with WebSocket endpoint
- **Communication**: WebSocket at `/api/admin/terminal`
- **Authentication**: Session cookie verification

### Database

The terminal connects directly to the SQLite database (`quiz_app.db`).

**Tables:**
- `users` - User accounts (id, github_id, username, role)
- `scores` - Quiz scores (id, user_id, quiz_id, score, timestamp)

---

## Troubleshooting

### "Access denied" Error

- Ensure you're logged in with a Teacher or Developer account
- Try logging out and back in
- Check that your role is set correctly in the database

### Connection Issues

- Click the Reconnect button
- Refresh the page
- Check that the backend server is running

### Terminal Not Responding

- Check the browser console for errors
- Ensure WebSocket connections are not blocked by firewall
- Try using a different browser
