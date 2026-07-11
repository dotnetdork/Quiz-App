/**
 * Workspaces Page — IDE-like coding environment
 *
 * Coming soon placeholder. Will function like an IDE where
 * students can write, run, and debug code for their projects.
 */
import AnimatedBackground from '../components/AnimatedBackground';

function TerminalIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function Workspaces() {
  return (
    <>
      <AnimatedBackground theme="neural" />
      <div className="coming-soon-page">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            <TerminalIcon size={48} />
          </div>
          <h2>Workspaces</h2>
          <p className="coming-soon-subtitle">Your coding environment is coming soon.</p>
          <p className="coming-soon-description">
            Write, run, and debug code right in the browser. Workspaces will give you
            a full IDE experience — file explorer, code editor, terminal, and live preview —
            all connected to your Studio projects.
          </p>
          <div className="coming-soon-features">
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Code editor with syntax highlighting</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Integrated terminal</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>Live preview of your app</span>
            </div>
            <div className="coming-soon-feature">
              <span className="feature-dot" />
              <span>AI-assisted debugging</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workspaces;
