/**
 * Studio Page — AI Builder
 *
 * Chat-first workspace inspired by Codecademy's AI Builder.
 * Two states:
 * 1. Welcome — "What do you want to build?" with suggestion chips
 * 2. Workspace — Chat + Live Preview split, Build/Learn tabs
 *
 * LeagueAI is central from day one. The student directs; AI executes.
 * SDLC phases are tracked subtly at the bottom, not as primary nav.
 */
import { useState, useEffect, useRef } from 'react';
import { apiCall } from '../api';
import { useAuth, getPrefetchedData } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

/* -- SVG Icons (Lucide-style, 1.5px stroke) -- */

function SparklesIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
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

function ArrowLeftIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
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

function PackageIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function EyeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* -- Constants -- */

const AI_MENTOR_NAME = 'LeagueAI';

const PHASES = [
  { id: 'discover', name: 'Discover', Icon: SearchIcon, color: '#1565c0' },
  { id: 'analyze', name: 'Analyze', Icon: UsersIcon, color: '#2e7d32' },
  { id: 'design', name: 'Design', Icon: PenToolIcon, color: '#ef6c00' },
  { id: 'build', name: 'Build', Icon: CodeIcon, color: '#c62828' },
  { id: 'ship', name: 'Ship', Icon: PackageIcon, color: '#7b1fa2' },
];

const SUGGESTION_CHIPS = [
  'A habit tracker app',
  'A recipe finder for busy people',
  'I need help finding an idea',
  'A portfolio website',
  'A game for my friends',
];

/* -- Main Studio Component -- */

function Studio() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [tokens] = useState({ current: 1500, total: 1500 });

  // View: 'welcome' or 'workspace'
  const [view, setView] = useState('welcome');
  const [projectName, setProjectName] = useState('');
  const [activeTab, setActiveTab] = useState('build');
  const [activePhase, setActivePhase] = useState('discover');
  const [showCode, setShowCode] = useState(false);

  // Chat state
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = authUser || await apiCall('/auth/me');
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const xp = progress?.xp || 0;
  const level = Math.floor(xp / 50) + 1;
  const RANK_NAMES = ['Explorer', 'Explorer', 'Scout', 'Designer', 'Designer', 'Builder', 'Builder', 'Architect', 'Architect', 'Architect', 'Shipper'];
  const rankName = RANK_NAMES[Math.min(level, RANK_NAMES.length - 1)];

  function startProject(prompt) {
    const name = extractProjectName(prompt);
    setProjectName(name);
    setChatMessages([
      { role: 'user', text: prompt },
      {
        role: 'assistant',
        text: `Great idea! I've started scaffolding "${name}" for you. I've broken this into 4 milestones across the SDLC phases. You can see a live preview on the right — describe changes and I'll update it. Switch to the Learn tab anytime to understand how the code works.`
      }
    ]);
    setView('workspace');
  }

  function extractProjectName(prompt) {
    const lower = prompt.toLowerCase();
    if (lower.includes('habit')) return 'Habit Tracker';
    if (lower.includes('recipe')) return 'Recipe Finder';
    if (lower.includes('portfolio')) return 'Portfolio Site';
    if (lower.includes('game')) return 'Game Project';
    if (lower.includes('idea') || lower.includes('help')) return 'New Project';
    // Capitalize first letter of prompt as fallback
    return prompt.length > 30 ? prompt.slice(0, 30) + '...' : prompt;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (view === 'welcome') {
      startProject(inputValue.trim());
    } else {
      setChatMessages(prev => [...prev, { role: 'user', text: inputValue }]);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: `I'm not connected to the ${AI_MENTOR_NAME} backend yet — that's coming soon! For now, describe your vision and I'll be ready to build it when the backend goes live.`
        }]);
      }, 500);
    }
    setInputValue('');
  }

  function handleChipClick(chip) {
    startProject(chip);
  }

  function resetToWelcome() {
    setView('welcome');
    setProjectName('');
    setChatMessages([]);
    setActiveTab('build');
    setActivePhase('discover');
    setShowCode(false);
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
      <div className="studio-builder">

        {/* Header */}
        <div className="studio-builder-header">
          <div>
            <h1>Studio</h1>
            <p>Build real things with {AI_MENTOR_NAME}</p>
          </div>
          <div className="studio-builder-meta">
            <span className="builder-rank-badge">{rankName} &middot; Lv. {level}</span>
            <span className="builder-tokens">
              <SparklesIcon size={14} />
              <span>{tokens.current} tokens</span>
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="studio-builder-main">

          {view === 'welcome' ? (
            /* ---- WELCOME STATE ---- */
            <div className="builder-welcome">
              <div className="builder-welcome-icon">
                <SparklesIcon size={32} />
              </div>
              <h2>What do you want to build?</h2>
              <p className="builder-welcome-subtitle">
                Describe your idea and {AI_MENTOR_NAME} will help you plan, design, and build it step by step. You direct — AI executes.
              </p>

              <div className="builder-chips">
                {SUGGESTION_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    className="builder-chip"
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form className="builder-welcome-input" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Describe what you want to build..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="builder-send-btn" disabled={!inputValue.trim()}>
                  <SendIcon size={18} />
                </button>
              </form>
            </div>
          ) : (
            /* ---- WORKSPACE STATE ---- */
            <div className="builder-workspace">
              {/* Workspace header */}
              <div className="builder-workspace-header">
                <div className="builder-workspace-nav">
                  <button className="builder-back-btn" onClick={resetToWelcome}>
                    <ArrowLeftIcon size={16} />
                    <span>New chat</span>
                  </button>
                  <span className="builder-nav-divider">|</span>
                  <span className="builder-project-name">{projectName}</span>
                </div>
                <div className="builder-tab-group">
                  <button
                    className={`builder-tab ${activeTab === 'build' ? 'active' : ''}`}
                    onClick={() => setActiveTab('build')}
                  >
                    Build
                  </button>
                  <button
                    className={`builder-tab ${activeTab === 'learn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('learn')}
                  >
                    Learn
                  </button>
                </div>
              </div>

              {/* Workspace body */}
              <div className="builder-workspace-body">
                {activeTab === 'build' ? (
                  <div className="builder-split">
                    {/* Chat panel */}
                    <div className="builder-chat-panel">
                      <div className="builder-chat-messages">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`builder-message ${msg.role}`}>
                            {msg.role === 'assistant' && (
                              <div className="builder-ai-avatar">
                                <SparklesIcon size={12} />
                              </div>
                            )}
                            <div className="builder-message-bubble">
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      <form className="builder-chat-input" onSubmit={handleSubmit}>
                        <input
                          type="text"
                          placeholder="Describe changes..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="builder-send-btn small" disabled={!inputValue.trim()}>
                          <SendIcon size={14} />
                        </button>
                      </form>
                    </div>

                    {/* Preview panel */}
                    <div className="builder-preview-panel">
                      <div className="builder-preview-toolbar">
                        <span className="builder-preview-label">
                          <EyeIcon size={14} />
                          {showCode ? 'Code' : 'Live preview'}
                        </span>
                        <button
                          className="builder-toggle-code"
                          onClick={() => setShowCode(!showCode)}
                        >
                          {showCode ? 'Preview' : 'View code'}
                        </button>
                      </div>

                      <div className="builder-preview-content">
                        {showCode ? (
                          <div className="builder-code-view">
                            <pre>
                              <code>{`// ${projectName}\n// Generated by ${AI_MENTOR_NAME}\n\nimport React from 'react';\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>${projectName}</h1>\n      <p>Your app is ready!</p>\n    </div>\n  );\n}\n\nexport default App;`}</code>
                            </pre>
                          </div>
                        ) : (
                          <div className="builder-preview-mock">
                            <div className="mock-header" />
                            <div className="mock-search" />
                            <div className="mock-grid">
                              <div className="mock-card mock-card-1" />
                              <div className="mock-card mock-card-2" />
                              <div className="mock-card mock-card-3" />
                              <div className="mock-card mock-card-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Learn tab */
                  <div className="builder-learn-panel">
                    <div className="builder-learn-content">
                      <div className="learn-milestone">
                        <div className="learn-milestone-header">
                          <span className="learn-milestone-number">1</span>
                          <div>
                            <h4>Project Setup & Structure</h4>
                            <p>Understand how your app is organized and why</p>
                          </div>
                        </div>
                        <div className="learn-tasks">
                          <div className="learn-task active">
                            <span className="learn-task-dot" />
                            <span>What is a React component?</span>
                          </div>
                          <div className="learn-task">
                            <span className="learn-task-dot" />
                            <span>How does your file structure work?</span>
                          </div>
                          <div className="learn-task">
                            <span className="learn-task-dot" />
                            <span>What are imports and exports?</span>
                          </div>
                        </div>
                      </div>

                      <div className="learn-milestone">
                        <div className="learn-milestone-header">
                          <span className="learn-milestone-number">2</span>
                          <div>
                            <h4>Building the UI</h4>
                            <p>Learn how the visual elements are created</p>
                          </div>
                        </div>
                        <div className="learn-tasks">
                          <div className="learn-task">
                            <span className="learn-task-dot" />
                            <span>What is JSX?</span>
                          </div>
                          <div className="learn-task">
                            <span className="learn-task-dot" />
                            <span>How does CSS styling work here?</span>
                          </div>
                        </div>
                      </div>

                      <div className="learn-milestone">
                        <div className="learn-milestone-header">
                          <span className="learn-milestone-number">3</span>
                          <div>
                            <h4>Adding Interactivity</h4>
                            <p>Make your app respond to user actions</p>
                          </div>
                        </div>
                      </div>

                      <div className="learn-milestone">
                        <div className="learn-milestone-header">
                          <span className="learn-milestone-number">4</span>
                          <div>
                            <h4>Data & State</h4>
                            <p>How your app remembers and updates information</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phase indicator */}
              <div className="builder-phase-indicator">
                <span className="builder-phase-label">Phase:</span>
                {PHASES.map(phase => (
                  <button
                    key={phase.id}
                    className={`builder-phase-pill ${activePhase === phase.id ? 'active' : ''}`}
                    onClick={() => setActivePhase(phase.id)}
                    style={{ '--pill-color': phase.color }}
                  >
                    <phase.Icon size={12} />
                    <span>{phase.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Studio;
