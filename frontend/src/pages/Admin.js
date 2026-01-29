/**
 * Admin Page Component
 * 
 * Teacher-only dashboard showing all students and their attempts.
 * Requires the user to have 'teacher' role.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall, API_URL } from '../api';

function Admin() {
  // State
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptError, setAttemptError] = useState(null);

  // Load admin data on mount
  useEffect(() => {
    async function loadAdminData() {
      try {
        // Check user role
        const userData = await apiCall('/auth/me');
        setUser(userData);
        
        if (userData.role !== 'teacher') {
          setError('Access denied. Teacher role required.');
          setLoading(false);
          return;
        }
        
        // Load students and stats
        const [studentsData, statsData] = await Promise.all([
          apiCall('/api/admin/students'),
          apiCall('/api/admin/stats'),
        ]);
        
        setStudents(studentsData.students || []);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadAdminData();
  }, []);

  /**
   * Load attempts for a specific student
   */
  async function loadStudentAttempts(studentId) {
    setAttemptError(null);
    try {
      const data = await apiCall(`/api/admin/student/${studentId}/attempts`);
      setSelectedStudent(data.student);
      setAttempts(data.attempts || []);
    } catch (err) {
      setAttemptError('Error loading student attempts: ' + err.message);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // Show access denied or login prompt
  if (error || !user || user.role !== 'teacher') {
    return (
      <div className="text-center mt-lg">
        <h2>Access Denied</h2>
        <p>
          {error || 'You need teacher privileges to access this page.'}
        </p>
        {!user ? (
          <a href={`${API_URL}/auth/login`} className="github-login mt-md" style={{ display: 'inline-flex' }}>
            Login with GitHub
          </a>
        ) : (
          <Link to="/dashboard" className="btn-secondary mt-md" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Back to Dashboard
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="card mb-lg">
        <h1>Teacher Dashboard</h1>
        <p className="text-secondary">
          Logged in as: <strong>{user.username}</strong> (Teacher)
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total_students}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.total_attempts}</div>
            <div className="stat-label">Quiz Attempts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.average_score}</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>
      )}

      {/* Error message for student attempts */}
      {attemptError && (
        <div className="error-message">
          <p>{attemptError}</p>
        </div>
      )}

      {/* Student List */}
      <section className="mt-lg">
        <h2>All Students</h2>
        
        {students.length === 0 ? (
          <div className="card">
            <p>No students registered yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>GitHub ID</th>
                <th>Quiz Attempts</th>
                <th>Total Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.username}</strong></td>
                  <td>{student.github_id}</td>
                  <td>{student.total_attempts}</td>
                  <td>{student.total_points}</td>
                  <td>
                    <button 
                      className="btn-secondary"
                      onClick={() => loadStudentAttempts(student.id)}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      View Attempts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Selected Student Attempts */}
      {selectedStudent && (
        <section className="mt-lg">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Attempts for {selectedStudent.username}</h2>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedStudent(null)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Close
              </button>
            </div>
            
            <p className="text-secondary mb-md">
              GitHub ID: {selectedStudent.github_id}
            </p>
            
            {attempts.length === 0 ? (
              <p>No quiz attempts yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Quiz ID</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td>{attempt.quiz_id}</td>
                      <td>{attempt.score}</td>
                      <td>{new Date(attempt.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Admin Note */}
      <div className="card mt-lg">
        <h3>Admin Note</h3>
        <p className="text-secondary">
          To promote a student to teacher, update their role directly in the 
          SQLite database: <code>UPDATE users SET role='teacher' WHERE username='...';</code>
        </p>
      </div>
    </div>
  );
}

export default Admin;
