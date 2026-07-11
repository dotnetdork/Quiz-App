/**
 * Main App Component
 *
 * Root component with sidebar navigation layout.
 * Sidebar with icon+label nav items on desktop,
 * bottom tab bar on mobile.
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ClickParticles from './components/ClickParticles';
import { AuthProvider } from './context/AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quiz = lazy(() => import('./pages/Quiz'));
const CourseMap = lazy(() => import('./pages/CourseMap'));
const QuestDetail = lazy(() => import('./pages/QuestDetail'));
const Learn = lazy(() => import('./pages/Learn'));
const Crucible = lazy(() => import('./pages/Crucible'));
const Workspaces = lazy(() => import('./pages/Workspaces'));

/* ------------------------------------------------
   SVG Nav Icons (24x24, 1.5px stroke, Lucide-style)
   ------------------------------------------------ */
function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function CourseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function CrucibleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="17" x2="4" y2="20" />
      <line x1="3" y1="19" x2="5" y2="21" />
    </svg>
  );
}

function StudioIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function WorkspacesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/**
 * App Logo - Orange square with lightning bolt
 */
function AppLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quiz-App Logo"
    >
      <rect width="40" height="40" rx="8" fill="#ef6c00"/>
      <path
        d="M22 6L10 22H18L16 34L30 18H22L24 6H22Z"
        fill="white"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sidebar Navigation
 */
function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/learn') return location.pathname === '/learn';
    if (path === '/crucible') return location.pathname === '/crucible';
    if (path === '/workspaces') return location.pathname === '/workspaces';
    if (path === '/course') return location.pathname.startsWith('/course');
    return false;
  };

  return (
    <nav className="nav" aria-label="Main navigation">
      <Link to="/dashboard" className="nav-brand">
        <AppLogo size={36} />
        <span>Quiz-App</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/learn" className={isActive('/learn') ? 'active' : ''}>
            <LearnIcon />
            <span>Learn</span>
          </Link>
        </li>
        <li>
          <Link to="/crucible" className={isActive('/crucible') ? 'active' : ''}>
            <CrucibleIcon />
            <span>Crucible</span>
          </Link>
        </li>
        <li>
          <Link to="/workspaces" className={isActive('/workspaces') ? 'active' : ''}>
            <WorkspacesIcon />
            <span>Workspaces</span>
          </Link>
        </li>
        <li>
          <Link to="/course/build-real-stuff" className={isActive('/course') ? 'active' : ''}>
            <StudioIcon />
            <span>Studio</span>
          </Link>
        </li>
      </ul>

      <div className="nav-footer">
        <a href="/auth/logout" className="btn-logout">
          <LogoutIcon />
          <span>Log out</span>
        </a>
      </div>
    </nav>
  );
}

/**
 * Footer
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2026 The League of Amazing Programmers</p>
        <p>
          <a href="https://www.jointheleague.org/" target="_blank" rel="noopener noreferrer">
            jointheleague.org
          </a>
        </p>
      </div>
    </footer>
  );
}

/**
 * Main App
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * AppContent - Conditional layout based on route
 */
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && <ClickParticles />}
      {!isLoginPage && <Navigation />}

      <main className={isLoginPage ? '' : 'app-main'}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/crucible" element={<ProtectedRoute><Crucible /></ProtectedRoute>} />
            <Route path="/workspaces" element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
            <Route path="/quiz/:quizId" element={
              <ProtectedRoute><Quiz /></ProtectedRoute>
            } />
            <Route path="/course/:courseSlug" element={
              <ProtectedRoute><CourseMap /></ProtectedRoute>
            } />
            <Route path="/course/:courseSlug/quest/:questId" element={
              <ProtectedRoute><QuestDetail /></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>

      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
