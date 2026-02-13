/**
 * Login Page Component
 * 
 * Full-screen login page shown when user is not authenticated.
 * Space-themed background with floating stars and planets.
 */
import { useEffect, useRef } from 'react';
import { API_URL } from '../api';

// Space background with stars and floating objects
function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let planets = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initPlanets();
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 4000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };

    // Initialize floating planets/objects
    const initPlanets = () => {
      planets = [
        { x: canvas.width * 0.15, y: canvas.height * 0.2, size: 60, color: '#ef6c00', speed: 0.2, phase: 0 },
        { x: canvas.width * 0.85, y: canvas.height * 0.7, size: 40, color: '#1a365d', speed: 0.15, phase: Math.PI },
        { x: canvas.width * 0.1, y: canvas.height * 0.8, size: 25, color: '#4caf50', speed: 0.25, phase: Math.PI / 2 },
        { x: canvas.width * 0.9, y: canvas.height * 0.15, size: 35, color: '#ff9800', speed: 0.18, phase: Math.PI * 1.5 }
      ];
    };

    // Animation loop with delta time for smooth animations
    let lastTime = performance.now();
    let time = 0;
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      time += deltaTime;
      
      ctx.fillStyle = 'rgba(10, 15, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient nebula effect
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(239, 108, 0, 0.08)');
      gradient.addColorStop(0.5, 'rgba(26, 54, 93, 0.05)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        // Slow drift
        star.y += star.speed;
        if (star.y > canvas.height + 5) {
          star.y = -5;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw floating planets with glow
      planets.forEach(planet => {
        const floatY = Math.sin(time + planet.phase) * 15;
        const floatX = Math.cos(time * 0.5 + planet.phase) * 8;

        // Outer glow
        const glow = ctx.createRadialGradient(
          planet.x + floatX, planet.y + floatY, 0,
          planet.x + floatX, planet.y + floatY, planet.size * 2
        );
        glow.addColorStop(0, planet.color + '40');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(planet.x + floatX, planet.y + floatY, planet.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.beginPath();
        ctx.arc(planet.x + floatX, planet.y + floatY, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color + '80';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-canvas" />;
}

function Login() {
  return (
    <div className="login-page-fullscreen">
      <SpaceBackground />
      <div className="login-container">
        <div className="login-decorative-images">
          <img 
            src="/images/clearRobot3Color1.png" 
            alt="Robot mascot"
            className="robot-decoration"
          />
        </div>
        
        <h1>Welcome to Quiz-App</h1>
        <p className="login-subtitle">
          Test your programming knowledge with interactive quizzes
        </p>
        
        <a href={`${API_URL}/auth/login`} className="github-login-btn">
          <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Login with GitHub
        </a>
        
        <div className="login-logo-footer">
          <img 
            src="/images/logo_JTL_horiz.png" 
            alt="The League of Amazing Programmers"
            className="league-logo"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
