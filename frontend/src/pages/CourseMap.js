/**
 * Studio Page — "Create" Mode
 *
 * Three-panel layout:
 * - Left: Project sidebar (capstone + guided projects, XP/level)
 * - Center: Phase-dependent workspace with phase nav bar
 * - Right: AI Mentor panel (chat stub, credits display)
 *
 * {AI_MENTOR_NAME} is available in every phase from day one. The student directs;
 * {AI_MENTOR_NAME} executes. Concept checkpoints are interactive games, not essays.
 */
import { useState, useEffect } from 'react';
import { apiCall } from '../api';
import { useAuth, getPrefetchedData } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

/* -- SVG Icons (Lucide-style) -- */

function RocketIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function SearchIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UsersIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function PenToolIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function CodeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function PackageIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function SparklesIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}

function PlusIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SendIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* -- Phase definitions -- */

const PHASES = [
  { id: 'discover', name: 'Discover', Icon: SearchIcon, color: '#1565c0', description: 'Find a real problem worth solving' },
  { id: 'analyze', name: 'Analyze', Icon: UsersIcon, color: '#2e7d32', description: 'Understand your users and the landscape' },
  { id: 'design', name: 'Design', Icon: PenToolIcon, color: '#ef6c00', description: 'Turn research into screens and wireframes' },
  { id: 'build', name: 'Build', Icon: CodeIcon, color: '#c62828', description: 'Direct {AI_MENTOR_NAME} to build your application' },
  { id: 'ship', name: 'Ship', Icon: PackageIcon, color: '#7b1fa2', description: 'Polish, test, and present your work' },
];

/* -- Sample guided projects -- */

const GUIDED_PROJECTS = [
  { id: 'login-flow', name: 'Design a Login Flow', phase: 'design', xp: 150, difficulty: 'Beginner' },
  { id: 'user-research', name: 'Interview Real Users', phase: 'discover', xp: 200, difficulty: 'Beginner' },
  { id: 'spot-ux-mistake', name: 'Spot the UX Mistake', phase: 'design', xp: 100, difficulty: 'Beginner' },
  { id: 'build-component', name: 'Build a Component', phase: 'build', xp: 250, difficulty: 'Intermediate' },
  { id: 'security-audit', name: 'Find the Security Flaw', phase: 'build', xp: 200, difficulty: 'Intermediate' },
];

/* -- AI Mentor Configuration -- */
const AI_MENTOR_NAME = 'LeagueAI';

/* -- AI Mentor suggestions per phase -- */

const AI_SUGGESTIONS = {
  discover: [
    'Help me brainstorm problems to solve',
    'Draft interview questions for my user',
    'What makes a good positioning statement?',
  ],
  analyze: [
    'Find apps similar to my idea',
    'Create a persona from my interview notes',
    'What are jobs-to-be-done?',
  ],
  design: [
    'Suggest a layout for my main screen',
    'Review my wireframe for UX issues',
    'What is visual hierarchy?',
  ],
  build: [
    'Scaffold my project from wireframes',
    'Build the navbar component',
    'Explain how this code works',
  ],
  ship: [
    'Review my app for accessibility',
    'Help me write my demo script',
    'What should I test before launching?',
  ],
};

/* -- Phase workspace content -- */

function PhaseWorkspace({ phase, project }) {
  const phaseData = PHASES.find(p => p.id === phase);

  if (!project) {
    return (
      <div className="studio-workspace-empty">
        <RocketIcon size={48} />
        <h3>Select or create a project to get started</h3>
        <p>Pick a guided project to build skills, or start your capstone to build something real.</p>
      </div>
    );
  }

  return (
    <div className="studio-workspace-content">
      <div className="workspace-phase-header" style={{ '--phase-color': phaseData.color }}>
        <phaseData.Icon size={24} />
        <div>
          <h3>{phaseData.name}</h3>
          <p>{phaseData.description}</p>
        </div>
      </div>

      <div className="workspace-activity-area">
        {phase === 'discover' && (
          <>
            <div className="activity-card">
              <h4>Opportunity Notes</h4>
              <p className="text-secondary">Who has the problem? What friction did you observe? Write quick notes from real conversations.</p>
              <textarea
                className="studio-textarea"
                placeholder="Marcus mentioned he spends 20 min every morning looking for recipes..."
                rows={4}
              />
            </div>
            <div className="activity-card">
              <h4>Positioning Statement</h4>
              <p className="text-secondary">One sentence that captures what you are building and for whom. Ask {AI_MENTOR_NAME} to help draft it.</p>
              <div className="positioning-template">
                <span className="template-label">For</span>
                <input type="text" placeholder="[target users]" className="template-input" />
                <span className="template-label">who</span>
                <input type="text" placeholder="[have this problem]" className="template-input" />
                <span className="template-label">our product is a</span>
                <input type="text" placeholder="[category]" className="template-input" />
                <span className="template-label">that</span>
                <input type="text" placeholder="[key benefit]" className="template-input" />
              </div>
            </div>
          </>
        )}

        {phase === 'analyze' && (
          <>
            <div className="activity-card">
              <h4>Landscape</h4>
              <p className="text-secondary">What already exists? Ask {AI_MENTOR_NAME} to research competitors.</p>
              <button className="btn-studio-action">
                <SparklesIcon size={16} /> Ask {AI_MENTOR_NAME} to find similar apps
              </button>
            </div>
            <div className="activity-card">
              <h4>User Personas</h4>
              <p className="text-secondary">Based on your interviews, who are the key users?</p>
              <div className="persona-placeholder">
                <div className="persona-avatar-placeholder" />
                <span>No personas yet</span>
              </div>
            </div>
          </>
        )}

        {phase === 'design' && (
          <>
            <div className="activity-card">
              <h4>Screen Inventory</h4>
              <p className="text-secondary">List every screen your app needs.</p>
              <div className="screen-list-placeholder">
                <div className="screen-item-placeholder">
                  <span className="screen-number">1</span>
                  <input type="text" placeholder="e.g. Home / Recipe Browser" className="screen-input" />
                </div>
                <div className="screen-item-placeholder">
                  <span className="screen-number">2</span>
                  <input type="text" placeholder="e.g. Recipe Detail" className="screen-input" />
                </div>
                <button className="btn-add-screen"><PlusIcon size={14} /> Add screen</button>
              </div>
            </div>
            <div className="activity-card">
              <h4>Wireframes</h4>
              <p className="text-secondary">Describe a screen to {AI_MENTOR_NAME} and it will generate a wireframe.</p>
              <div className="wireframe-placeholder">
                <div className="wireframe-canvas">
                  <span>Wireframe canvas</span>
                  <p>Describe a screen to get started</p>
                </div>
              </div>
            </div>
          </>
        )}

        {phase === 'build' && (
          <>
            <div className="activity-card">
              <h4>Project Structure</h4>
              <p className="text-secondary">Tell {AI_MENTOR_NAME} to scaffold your project from your wireframes.</p>
              <button className="btn-studio-action">
                <SparklesIcon size={16} /> Scaffold from my wireframes
              </button>
              <div className="file-tree-placeholder">
                <code>
                  my-app/<br/>
                  &nbsp;&nbsp;src/<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;components/<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;pages/<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;App.js<br/>
                  &nbsp;&nbsp;package.json
                </code>
              </div>
            </div>
            <div className="activity-card">
              <h4>Build Components</h4>
              <p className="text-secondary">Direct {AI_MENTOR_NAME} one component at a time.</p>
              <div className="component-list-placeholder">
                <span className="text-secondary">Components will appear here as you build them</span>
              </div>
            </div>
          </>
        )}

        {phase === 'ship' && (
          <>
            <div className="activity-card">
              <h4>Quality Check</h4>
              <p className="text-secondary">Ask {AI_MENTOR_NAME} to audit your app for issues.</p>
              <button className="btn-studio-action">
                <SparklesIcon size={16} /> Run accessibility audit
              </button>
              <button className="btn-studio-action secondary">
                <SparklesIcon size={16} /> Check for security issues
              </button>
            </div>
            <div className="activity-card">
              <h4>Demo Prep</h4>
              <p className="text-secondary">{AI_MENTOR_NAME} can help write talking points from your positioning statement.</p>
              <button className="btn-studio-action">
                <SparklesIcon size={16} /> Draft my demo script
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -- Main Studio Component -- */

function Studio() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState('discover');
  const [activeProject, setActiveProject] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', text: `Hey! I'm ${AI_MENTOR_NAME}, your handy helper. I'm here in every phase. Ask me to research, draft, build, or review anything. You direct, I execute. What are we working on?` }
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [tokens] = useState({ current: 1500, total: 1500 });

  useEffect(() => {
    async function loadData() {
      try {
        const userData = authUser || await apiCall('/auth/me');
        setUser(userData);
        const prefetched = getPrefetchedData();
        if (prefetched?.courseProgress) {
          setProgress(prefetched.courseProgress);
        } else {
          try {
            const prog = await apiCall('/api/courses/build-real-stuff/progress');
            setProgress(prog);
          } catch {
            setProgress({ xp: 0, streak_count: 0, completed_quest_ids: [] });
          }
        }
      } catch {
        setProgress({ xp: 0, streak_count: 0, completed_quest_ids: [] });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authUser]);

  const xp = progress?.xp || 0;
  const level = Math.floor(xp / 50) + 1;
  const levelProgress = ((xp % 50) / 50) * 100;

  const RANK_NAMES = ['Explorer', 'Explorer', 'Scout', 'Designer', 'Designer', 'Builder', 'Builder', 'Architect', 'Architect', 'Architect', 'Shipper'];
  const rankName = RANK_NAMES[Math.min(level, RANK_NAMES.length - 1)];

  function getTokenUsagePercent() {
    if (!tokens.total) return 0;
    return Math.min((tokens.current / tokens.total) * 100, 100);
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text: aiMessage }]);
    setTimeout(() => {
      setAiChat(prev => [...prev, {
        role: 'assistant',
        text: `I'm not connected to the ${AI_MENTOR_NAME} backend yet. That's coming next week! For now, use me as a notepad for your ideas.`
      }]);
    }, 500);
    setAiMessage('');
  }

  function selectProject(project) {
    setActiveProject(project);
    if (project.phase) {
      setActivePhase(project.phase);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton-stats">
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground theme="neural" />
      <div className={`studio-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        {/* LEFT: Project Sidebar */}
        <aside className={`studio-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="studio-sidebar-header">
            <h2>Studio</h2>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>

          <div className="studio-level-card">
            <div className="level-info">
              <span className="level-rank">{rankName}</span>
              <span className="level-number">Lv. {level}</span>
            </div>
            <div className="level-bar">
              <div className="level-bar-fill" style={{ width: `${levelProgress}%` }} />
            </div>
            <span className="level-xp">{xp} XP</span>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">My Project</h3>
            <button
              className={`project-item capstone ${activeProject?.id === 'capstone' ? 'active' : ''}`}
              onClick={() => selectProject({ id: 'capstone', name: 'My Capstone', type: 'capstone' })}
            >
              <RocketIcon size={18} />
              <div className="project-item-info">
                <span className="project-name">My Capstone</span>
                <span className="project-phase">Phase: {PHASES.find(p => p.id === activePhase)?.name || 'Discover'}</span>
              </div>
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Guided Projects</h3>
            {GUIDED_PROJECTS.map(project => {
              const phaseMatch = PHASES.find(p => p.id === project.phase);
              const Icon = phaseMatch ? phaseMatch.Icon : CodeIcon;
              return (
                <button
                  key={project.id}
                  className={`project-item guided ${activeProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => selectProject(project)}
                >
                  <Icon size={16} />
                  <div className="project-item-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-meta">{project.xp} XP</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button className="btn-new-project">
            <PlusIcon size={16} />
            <span>New Project</span>
          </button>
        </aside>

        {/* CENTER: Workspace */}
        <main className="studio-main">
          <div className="phase-nav">
            {PHASES.map((phase, index) => (
              <button
                key={phase.id}
                className={`phase-tab ${activePhase === phase.id ? 'active' : ''}`}
                onClick={() => setActivePhase(phase.id)}
                style={{ '--phase-color': phase.color }}
              >
                <phase.Icon size={18} />
                <span className="phase-tab-name">{phase.name}</span>
                {index < PHASES.length - 1 && <span className="phase-connector" />}
              </button>
            ))}
          </div>

          <div className="phase-progress-track">
            <div
              className="phase-progress-fill"
              style={{
                width: `${((PHASES.findIndex(p => p.id === activePhase) + 1) / PHASES.length) * 100}%`,
                backgroundColor: PHASES.find(p => p.id === activePhase)?.color
              }}
            />
          </div>

          <div className="studio-workspace">
            <PhaseWorkspace phase={activePhase} project={activeProject} />
          </div>
        </main>

      </div>

      {/* Floating AI Mentor Widget */}
      {aiPanelOpen ? (
        <div className="ai-widget open">
          <div className="ai-panel-header">
            <SparklesIcon size={20} />
            <h3>{AI_MENTOR_NAME}</h3>
            <span className="ai-status-badge">Available</span>
            <button
              className="ai-panel-btn"
              onClick={() => setAiPanelOpen(false)}
              aria-label="Minimize AI Mentor"
            >
              <XIcon size={16} />
            </button>
          </div>

          <div className="ai-chat-messages">
            {aiChat.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-avatar">
                    <SparklesIcon size={14} />
                  </div>
                )}
                <div className="ai-message-bubble">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-suggestions">
            {(AI_SUGGESTIONS[activePhase] || []).map((suggestion, i) => (
              <button
                key={i}
                className="ai-suggestion-chip"
                onClick={() => setAiMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form className="ai-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="ai-input"
              placeholder="Ask me anything..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
            />
            <button type="submit" className="ai-send-btn" disabled={!aiMessage.trim()}>
              <SendIcon size={16} />
            </button>
          </form>

          <div className="ai-credits">
            <span className="credits-label">Tokens</span>
            <div className="credits-bar">
              <div className="credits-bar-fill" style={{ width: `${getTokenUsagePercent()}%` }} />
            </div>
            <span className="credits-count">{tokens.current} / {tokens.total}</span>
          </div>
        </div>
      ) : (
        <button
          className="ai-fab"
          onClick={() => setAiPanelOpen(true)}
          aria-label="Open AI Mentor"
        >
          <SparklesIcon size={24} />
        </button>
      )}
    </>
  );
}

export default Studio;
