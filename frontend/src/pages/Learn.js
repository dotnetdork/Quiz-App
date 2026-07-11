/**
 * Learn Page — Course Catalog
 *
 * Coming soon placeholder. Will list all available courses
 * students can browse, preview, and enroll in.
 */
import AnimatedBackground from '../components/AnimatedBackground';

function BookOpenIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function Learn() {
  return (
    <>
      <AnimatedBackground theme="default" />
      <div className="coming-soon-page">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            <BookOpenIcon size={48} />
          </div>
          <h2>Learn</h2>
          <p className="coming-soon-subtitle">Course catalog coming soon.</p>
          <p className="coming-soon-description">
            Browse, preview, and enroll in courses across Python, Java, web development,
            UI/UX design, and more. Each course has structured lessons, hands-on projects,
            and progress tracking to help you level up.
          </p>
          <div className="coming-soon-features">
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Course catalog with categories</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Enrollment and progress tracking</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Video lessons and interactive exercises</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Certificates of completion</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Learn;
