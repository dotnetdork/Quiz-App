/**
 * Login Page Component
 * 
 * Full-screen login page shown when user is not authenticated.
 * Space-themed background with floating stars, planets, code snippets, and tech icons.
 */
import { useEffect, useRef } from 'react';
import { API_URL } from '../api';

// Code snippets that float through space
const CODE_SNIPPETS = [
  'function hello() {',
  'return true;',
  'const x = 42;',
  'if (code) {',
  'for (let i = 0;',
  'class Robot:',
  'import quiz',
  'print("Hi!")',
  '// TODO: win',
  'score++;',
  '} else {',
  'while (true)',
  'def learn():',
  '<Quiz />',
];

// Space background with stars, floating code, and tech elements
function SpaceBackground() {
  const canvasRef = useRef(null);
  const robotImageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let planets = [];
    let codeElements = [];
    let techIcons = [];

    // Load robot image
    const robotImg = new Image();
    robotImg.src = '/images/clearRobot3Color1.png';
    robotImageRef.current = robotImg;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initPlanets();
      initCodeElements();
      initTechIcons();
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
        { x: canvas.width * 0.12, y: canvas.height * 0.18, size: 50, color: '#ef6c00', speed: 0.2, phase: 0 },
        { x: canvas.width * 0.88, y: canvas.height * 0.75, size: 35, color: '#1a365d', speed: 0.15, phase: Math.PI },
        { x: canvas.width * 0.08, y: canvas.height * 0.82, size: 22, color: '#4caf50', speed: 0.25, phase: Math.PI / 2 },
        { x: canvas.width * 0.92, y: canvas.height * 0.12, size: 30, color: '#ff9800', speed: 0.18, phase: Math.PI * 1.5 }
      ];
    };

    // Initialize floating code elements
    const initCodeElements = () => {
      codeElements = [];
      const numCodes = 8;
      for (let i = 0; i < numCodes; i++) {
        codeElements.push({
          text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 0.4 + 0.2,
          opacity: Math.random() * 0.3 + 0.15,
          size: Math.random() * 4 + 12
        });
      }
    };

    // Initialize tech icons (drawn as simple shapes)
    const initTechIcons = () => {
      techIcons = [
        // Floating robot (uses image)
        { type: 'robot', x: canvas.width * 0.2, y: canvas.height * 0.35, size: 60, phase: 0, speed: 0.3 },
        // Gear icon
        { type: 'gear', x: canvas.width * 0.85, y: canvas.height * 0.25, size: 30, phase: Math.PI / 3, speed: 0.2, rotation: 0 },
        // Code brackets
        { type: 'brackets', x: canvas.width * 0.15, y: canvas.height * 0.65, size: 25, phase: Math.PI / 2, speed: 0.25 },
        // Lightning bolt
        { type: 'bolt', x: canvas.width * 0.82, y: canvas.height * 0.55, size: 28, phase: Math.PI, speed: 0.22 },
      ];
    };

    // Draw a gear icon
    const drawGear = (x, y, size, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(239, 108, 0, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Draw gear teeth
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const innerRadius = size * 0.5;
        const outerRadius = size * 0.8;
        ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
        ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239, 108, 0, ${opacity * 0.5})`;
      ctx.fill();
      ctx.restore();
    };

    // Draw code brackets icon
    const drawBrackets = (x, y, size, opacity) => {
      ctx.save();
      ctx.font = `bold ${size}px 'Courier New', monospace`;
      ctx.fillStyle = `rgba(76, 175, 80, ${opacity})`;
      ctx.textAlign = 'center';
      ctx.fillText('{ }', x, y);
      ctx.restore();
    };

    // Draw lightning bolt icon
    const drawBolt = (x, y, size, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(255, 193, 7, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.3, -size * 0.2);
      ctx.lineTo(0, -size * 0.1);
      ctx.lineTo(size * 0.15, size);
      ctx.lineTo(-size * 0.15, size * 0.1);
      ctx.lineTo(0, size * 0.2);
      ctx.lineTo(-size * 0.3, -size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animation loop with delta time for smooth animations
    let lastTime = performance.now();
    let time = 0;
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
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

      // Second nebula on right side
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.4
      );
      gradient2.addColorStop(0, 'rgba(76, 175, 80, 0.05)');
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height + 5) {
          star.y = -5;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw floating code snippets
      codeElements.forEach(code => {
        ctx.save();
        ctx.font = `${code.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(100, 255, 218, ${code.opacity})`;
        ctx.fillText(code.text, code.x, code.y);
        ctx.restore();

        code.y += code.speed;
        if (code.y > canvas.height + 30) {
          code.y = -30;
          code.x = Math.random() * canvas.width;
          code.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        }
      });

      // Draw floating planets with glow
      planets.forEach(planet => {
        const floatY = Math.sin(time + planet.phase) * 15;
        const floatX = Math.cos(time * 0.5 + planet.phase) * 8;

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

        ctx.beginPath();
        ctx.arc(planet.x + floatX, planet.y + floatY, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color + '80';
        ctx.fill();
      });

      // Draw tech icons
      techIcons.forEach(icon => {
        const floatY = Math.sin(time * icon.speed + icon.phase) * 20;
        const floatX = Math.cos(time * icon.speed * 0.7 + icon.phase) * 12;
        const currentX = icon.x + floatX;
        const currentY = icon.y + floatY;
        const opacity = 0.4 + Math.sin(time + icon.phase) * 0.15;

        if (icon.type === 'robot' && robotImageRef.current && robotImageRef.current.complete) {
          ctx.save();
          ctx.globalAlpha = opacity;
          const imgSize = icon.size;
          ctx.drawImage(robotImageRef.current, currentX - imgSize/2, currentY - imgSize/2, imgSize, imgSize);
          ctx.restore();
        } else if (icon.type === 'gear') {
          icon.rotation = (icon.rotation || 0) + deltaTime * 0.5;
          drawGear(currentX, currentY, icon.size, icon.rotation, opacity);
        } else if (icon.type === 'brackets') {
          drawBrackets(currentX, currentY, icon.size, opacity);
        } else if (icon.type === 'bolt') {
          drawBolt(currentX, currentY, icon.size, opacity);
        }
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
        <h1 className="login-title">
          <span className="title-bracket">&lt;</span>
          Quiz-App
          <span className="title-bracket">/&gt;</span>
        </h1>
        <p className="login-subtitle">
          Level up your coding skills! Take interactive quizzes on Python, Java, and more.
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
