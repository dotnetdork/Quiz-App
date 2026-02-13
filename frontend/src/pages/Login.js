/**
 * Login Page Component
 * 
 * Full-screen login page shown when user is not authenticated.
 * Space-themed background with floating stars, planets, code snippets, and tech icons.
 * All elements gravitate towards the screen, creating an immersive forward-motion effect.
 */
import { useEffect, useRef, useState } from 'react';
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

// Vibrant colors for code snippets (RGB format for easier opacity handling)
const CODE_COLORS = [
  { r: 100, g: 255, b: 218 }, // Cyan/Teal
  { r: 255, g: 107, b: 157 }, // Pink
  { r: 255, g: 217, b: 61 },  // Yellow
  { r: 107, g: 203, b: 119 }, // Green
  { r: 77, g: 150, b: 255 },  // Blue
  { r: 255, g: 140, b: 66 },  // Orange
  { r: 201, g: 177, b: 255 }, // Lavender
  { r: 0, g: 212, b: 255 },   // Electric Blue
  { r: 255, g: 94, b: 120 },  // Coral
  { r: 152, g: 216, b: 170 }, // Mint
];

// Shooting star color constants
const SHOOTING_STAR_YELLOW_PROBABILITY = 0.3;
const SHOOTING_STAR_COLORS = {
  yellow: { r: 255, g: 217, b: 61 },
  white: { r: 255, g: 255, b: 255 }
};

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
    let shootingStars = [];
    let asteroids = [];
    let nebulaOffset = 0;

    // Load robot image
    const robotImg = new Image();
    robotImg.src = '/images/clearRobot3Color1.png';
    robotImageRef.current = robotImg;

    // Get center of screen
    const getCenterX = () => canvas.width / 2;
    const getCenterY = () => canvas.height / 2;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initPlanets();
      initCodeElements();
      initTechIcons();
      initAsteroids();
    };

    // Initialize stars with radial movement from center (gravitate towards screen effect)
    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 3000);
      for (let i = 0; i < numStars; i++) {
        // Start stars from random positions across the canvas
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(canvas.width, canvas.height) * 0.8;
        stars.push({
          x: getCenterX() + Math.cos(angle) * distance,
          y: getCenterY() + Math.sin(angle) * distance,
          z: Math.random() * 1000 + 100, // Depth for 3D effect
          size: Math.random() * 2 + 0.5,
          baseSize: Math.random() * 2 + 0.5,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          angle: angle,
          distance: distance
        });
      }
    };

    // Initialize floating planets/objects with unique textures
    const initPlanets = () => {
      planets = [
        { 
          x: canvas.width * 0.12, y: canvas.height * 0.18, 
          baseX: canvas.width * 0.12, baseY: canvas.height * 0.18,
          size: 50, color: '#ef6c00', speed: 0.2, phase: 0,
          type: 'gas', rotation: 0, rotationSpeed: 0.3,
          rings: true, stripeCount: 5, z: 800
        },
        { 
          x: canvas.width * 0.88, y: canvas.height * 0.75, 
          baseX: canvas.width * 0.88, baseY: canvas.height * 0.75,
          size: 35, color: '#1a365d', speed: 0.15, phase: Math.PI,
          type: 'rocky', rotation: 0, rotationSpeed: 0.5,
          craters: true, z: 600
        },
        { 
          x: canvas.width * 0.08, y: canvas.height * 0.82, 
          baseX: canvas.width * 0.08, baseY: canvas.height * 0.82,
          size: 22, color: '#4caf50', speed: 0.25, phase: Math.PI / 2,
          type: 'ice', rotation: 0, rotationSpeed: 0.4,
          glow: true, z: 500
        },
        { 
          x: canvas.width * 0.92, y: canvas.height * 0.12, 
          baseX: canvas.width * 0.92, baseY: canvas.height * 0.12,
          size: 30, color: '#ff9800', speed: 0.18, phase: Math.PI * 1.5,
          type: 'lava', rotation: 0, rotationSpeed: 0.6,
          spots: true, z: 700
        }
      ];
    };

    // Initialize floating code elements with random colors
    const initCodeElements = () => {
      codeElements = [];
      const numCodes = 12;
      for (let i = 0; i < numCodes; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(canvas.width, canvas.height) * 0.6;
        codeElements.push({
          text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          x: getCenterX() + Math.cos(angle) * distance,
          y: getCenterY() + Math.sin(angle) * distance,
          z: Math.random() * 800 + 200,
          speed: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.3,
          size: Math.random() * 6 + 12,
          color: CODE_COLORS[Math.floor(Math.random() * CODE_COLORS.length)],
          angle: angle,
          distance: distance
        });
      }
    };

    // Initialize tech icons (drawn as simple shapes)
    const initTechIcons = () => {
      techIcons = [
        // Floating robot (uses image)
        { type: 'robot', x: canvas.width * 0.2, y: canvas.height * 0.35, size: 60, phase: 0, speed: 0.3, z: 700, scale: 1 },
        // Gear icon
        { type: 'gear', x: canvas.width * 0.85, y: canvas.height * 0.25, size: 30, phase: Math.PI / 3, speed: 0.2, rotation: 0, z: 500, scale: 1 },
        // Code brackets
        { type: 'brackets', x: canvas.width * 0.15, y: canvas.height * 0.65, size: 25, phase: Math.PI / 2, speed: 0.25, z: 600, scale: 1 },
        // Additional tech icons
        { type: 'binary', x: canvas.width * 0.75, y: canvas.height * 0.6, size: 20, phase: Math.PI / 4, speed: 0.15, z: 400, scale: 1 },
        { type: 'circuit', x: canvas.width * 0.3, y: canvas.height * 0.8, size: 35, phase: Math.PI, speed: 0.22, z: 550, scale: 1 },
      ];
    };

    // Initialize asteroids
    const initAsteroids = () => {
      asteroids = [];
      const numAsteroids = 6;
      for (let i = 0; i < numAsteroids; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(canvas.width, canvas.height) * 0.7;
        asteroids.push({
          x: getCenterX() + Math.cos(angle) * distance,
          y: getCenterY() + Math.sin(angle) * distance,
          z: Math.random() * 600 + 300,
          size: Math.random() * 15 + 8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          speed: Math.random() * 1 + 0.25,
          angle: angle,
          distance: distance,
          vertices: generateAsteroidVertices(),
          color: `hsl(${30 + Math.random() * 20}, ${20 + Math.random() * 30}%, ${30 + Math.random() * 20}%)`
        });
      }
    };

    // Generate irregular asteroid shape vertices
    const generateAsteroidVertices = () => {
      const vertices = [];
      const numVertices = 8 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const radius = 0.6 + Math.random() * 0.4;
        vertices.push({ angle, radius });
      }
      return vertices;
    };

    // Create a shooting star
    const createShootingStar = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const speed = 4 + Math.random() * 3;
      
      switch(side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -10;
          vx = (Math.random() - 0.5) * speed;
          vy = speed;
          break;
        case 1: // Right
          x = canvas.width + 10;
          y = Math.random() * canvas.height;
          vx = -speed;
          vy = (Math.random() - 0.5) * speed;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 10;
          vx = (Math.random() - 0.5) * speed;
          vy = -speed;
          break;
        default: // Left
          x = -10;
          y = Math.random() * canvas.height;
          vx = speed;
          vy = (Math.random() - 0.5) * speed;
      }
      
      shootingStars.push({
        x, y, vx, vy,
        length: 60 + Math.random() * 80,
        opacity: 0.8 + Math.random() * 0.2,
        life: 1,
        color: Math.random() < SHOOTING_STAR_YELLOW_PROBABILITY 
          ? SHOOTING_STAR_COLORS.yellow 
          : SHOOTING_STAR_COLORS.white
      });
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

    // Draw binary code icon
    const drawBinary = (x, y, size, opacity, time) => {
      ctx.save();
      ctx.font = `${size}px 'Courier New', monospace`;
      ctx.fillStyle = `rgba(100, 255, 218, ${opacity})`;
      ctx.textAlign = 'center';
      const binary = Math.sin(time * 2) > 0 ? '10110' : '01001';
      ctx.fillText(binary, x, y);
      ctx.restore();
    };

    // Draw circuit pattern icon
    const drawCircuit = (x, y, size, opacity, time) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = `rgba(77, 150, 255, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Draw circuit lines
      ctx.moveTo(-size, 0);
      ctx.lineTo(-size * 0.3, 0);
      ctx.lineTo(0, -size * 0.5);
      ctx.lineTo(size * 0.3, 0);
      ctx.lineTo(size, 0);
      ctx.stroke();
      // Draw nodes
      ctx.fillStyle = `rgba(77, 150, 255, ${opacity * (0.5 + Math.sin(time * 3) * 0.5)})`;
      ctx.beginPath();
      ctx.arc(-size * 0.3, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.3, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -size * 0.5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Draw asteroid
    const drawAsteroid = (asteroid, scale) => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.rotation);
      ctx.scale(scale, scale);
      
      ctx.beginPath();
      asteroid.vertices.forEach((vertex, i) => {
        const x = Math.cos(vertex.angle) * asteroid.size * vertex.radius;
        const y = Math.sin(vertex.angle) * asteroid.size * vertex.radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      
      // Fill with gradient for 3D effect
      const gradient = ctx.createRadialGradient(-asteroid.size * 0.3, -asteroid.size * 0.3, 0, 0, 0, asteroid.size);
      gradient.addColorStop(0, asteroid.color);
      gradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add crater details
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(asteroid.size * 0.2, asteroid.size * 0.1, asteroid.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-asteroid.size * 0.15, asteroid.size * 0.25, asteroid.size * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Draw planet with unique texture based on type
    const drawPlanet = (planet, time, scale) => {
      const floatY = Math.sin(time * planet.speed + planet.phase) * 15;
      const floatX = Math.cos(time * planet.speed * 0.5 + planet.phase) * 8;
      const currentX = planet.x + floatX;
      const currentY = planet.y + floatY;
      const currentSize = planet.size * scale;
      
      ctx.save();
      ctx.translate(currentX, currentY);

      // Outer glow
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize * 2.5);
      glow.addColorStop(0, planet.color + '40');
      glow.addColorStop(0.5, planet.color + '15');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Create clipping region for planet
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.clip();

      // Base planet color with gradient
      const baseGradient = ctx.createRadialGradient(
        -currentSize * 0.3, -currentSize * 0.3, 0,
        0, 0, currentSize * 1.2
      );
      baseGradient.addColorStop(0, planet.color);
      baseGradient.addColorStop(0.7, planet.color + 'cc');
      baseGradient.addColorStop(1, planet.color + '66');
      ctx.fillStyle = baseGradient;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fill();

      // Add unique textures based on planet type
      planet.rotation += planet.rotationSpeed * 0.01;

      if (planet.type === 'gas') {
        // Gas giant with horizontal stripes (spinning effect)
        for (let i = 0; i < planet.stripeCount; i++) {
          const stripeY = -currentSize + (currentSize * 2 / planet.stripeCount) * i;
          const stripeOffset = Math.sin(planet.rotation + i * 0.5) * currentSize * 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + (i % 2) * 0.1})`;
          ctx.beginPath();
          ctx.ellipse(stripeOffset, stripeY + currentSize * 0.1, currentSize * 0.9, currentSize * 0.15, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // Great spot
        ctx.fillStyle = 'rgba(200, 100, 50, 0.6)';
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(planet.rotation) * currentSize * 0.4, 
          currentSize * 0.2, 
          currentSize * 0.25, 
          currentSize * 0.15, 
          0, 0, Math.PI * 2
        );
        ctx.fill();
      } else if (planet.type === 'rocky') {
        // Rocky planet with craters
        const craterPositions = [
          { x: 0.3, y: -0.2, s: 0.2 },
          { x: -0.4, y: 0.3, s: 0.15 },
          { x: 0.1, y: 0.4, s: 0.12 },
          { x: -0.2, y: -0.4, s: 0.18 }
        ];
        craterPositions.forEach(crater => {
          const craterX = (Math.cos(planet.rotation) * crater.x - Math.sin(planet.rotation) * crater.y) * currentSize;
          const craterY = (Math.sin(planet.rotation) * crater.x + Math.cos(planet.rotation) * crater.y) * currentSize;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(craterX, craterY, currentSize * crater.s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(craterX - currentSize * 0.03, craterY - currentSize * 0.03, currentSize * crater.s * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (planet.type === 'ice') {
        // Ice planet with crystalline patterns
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
          const angle = planet.rotation + (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * currentSize * 0.8, Math.sin(angle) * currentSize * 0.8);
          ctx.stroke();
        }
        // Ice caps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, -currentSize * 0.7, currentSize * 0.5, currentSize * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, currentSize * 0.7, currentSize * 0.4, currentSize * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (planet.type === 'lava') {
        // Lava planet with glowing cracks
        ctx.strokeStyle = 'rgba(255, 100, 0, 0.8)';
        ctx.lineWidth = 2;
        const crackAngles = [0.2, 0.8, 1.5, 2.1, 2.8, 3.5, 4.2, 5.0];
        crackAngles.forEach((baseAngle, i) => {
          const angle = planet.rotation + baseAngle;
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(angle) * currentSize * 0.2,
            Math.sin(angle) * currentSize * 0.2
          );
          ctx.quadraticCurveTo(
            Math.cos(angle + 0.3) * currentSize * 0.5,
            Math.sin(angle + 0.3) * currentSize * 0.5,
            Math.cos(angle + 0.1) * currentSize * 0.9,
            Math.sin(angle + 0.1) * currentSize * 0.9
          );
          ctx.stroke();
        });
        // Glowing spots
        const glowIntensity = 0.3 + Math.sin(time * 3) * 0.2;
        ctx.fillStyle = `rgba(255, 200, 50, ${glowIntensity})`;
        ctx.beginPath();
        ctx.arc(currentSize * 0.2, -currentSize * 0.1, currentSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw rings for gas planet (outside clip region)
      if (planet.rings) {
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(0.3);
        ctx.strokeStyle = `rgba(200, 150, 100, 0.4)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, currentSize * 1.8, currentSize * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(180, 130, 80, 0.3)`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, currentSize * 1.5, currentSize * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    // Animation loop with delta time for smooth animations
    let lastTime = performance.now();
    let time = 0;
    let lastShootingStar = 0;
    
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      time += deltaTime;
      
      ctx.fillStyle = 'rgba(10, 15, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated nebula effect with movement
      nebulaOffset += deltaTime * 0.1;
      const nebulaX1 = canvas.width * (0.3 + Math.sin(nebulaOffset) * 0.05);
      const nebulaY1 = canvas.height * (0.4 + Math.cos(nebulaOffset * 0.7) * 0.05);
      
      const gradient = ctx.createRadialGradient(
        nebulaX1, nebulaY1, 0,
        nebulaX1, nebulaY1, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(239, 108, 0, 0.1)');
      gradient.addColorStop(0.5, 'rgba(26, 54, 93, 0.06)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Second animated nebula on right side
      const nebulaX2 = canvas.width * (0.8 + Math.cos(nebulaOffset * 0.8) * 0.05);
      const nebulaY2 = canvas.height * (0.7 + Math.sin(nebulaOffset * 0.6) * 0.05);
      
      const gradient2 = ctx.createRadialGradient(
        nebulaX2, nebulaY2, 0,
        nebulaX2, nebulaY2, canvas.width * 0.4
      );
      gradient2.addColorStop(0, 'rgba(76, 175, 80, 0.07)');
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Third nebula for more depth
      const nebulaX3 = canvas.width * (0.5 + Math.sin(nebulaOffset * 1.2) * 0.1);
      const nebulaY3 = canvas.height * (0.3 + Math.cos(nebulaOffset * 0.9) * 0.08);
      
      const gradient3 = ctx.createRadialGradient(
        nebulaX3, nebulaY3, 0,
        nebulaX3, nebulaY3, canvas.width * 0.3
      );
      gradient3.addColorStop(0, 'rgba(147, 112, 219, 0.05)');
      gradient3.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create shooting stars randomly
      if (currentTime - lastShootingStar > 2000 + Math.random() * 3000) {
        createShootingStar();
        lastShootingStar = currentTime;
      }

      // Draw and animate shooting stars
      shootingStars = shootingStars.filter(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.015;
        
        if (star.life <= 0) return false;
        if (star.x < -100 || star.x > canvas.width + 100 || 
            star.y < -100 || star.y > canvas.height + 100) return false;
        
        // Draw shooting star with trail
        const trailLength = star.length * star.life;
        const magnitude = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
        const normalizedVx = star.vx / magnitude;
        const normalizedVy = star.vy / magnitude;
        const trailEndX = star.x - normalizedVx * trailLength;
        const trailEndY = star.y - normalizedVy * trailLength;
        
        const gradient = ctx.createLinearGradient(star.x, star.y, trailEndX, trailEndY);
        const starAlpha = Math.min(star.opacity * star.life, 1);
        const colorAlpha = Math.min(star.opacity * star.life * 0.8, 1);
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${starAlpha})`);
        gradient.addColorStop(0.3, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${colorAlpha})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(trailEndX, trailEndY);
        ctx.stroke();
        
        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * star.life})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });

      // Draw and animate stars (gravitating towards screen - scaling up and moving outward)
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.3 + 0.7;
        
        // Calculate depth-based scaling (closer = larger)
        star.z -= star.speed * 1;
        if (star.z <= 1) {
          star.z = 1000;
          star.angle = Math.random() * Math.PI * 2;
          star.distance = Math.random() * 50;
        }
        
        const scale = 1000 / star.z;
        const projectedX = centerX + Math.cos(star.angle) * star.distance * scale;
        const projectedY = centerY + Math.sin(star.angle) * star.distance * scale;
        const projectedSize = star.baseSize * scale * 0.5;
        
        // Only draw if on screen
        if (projectedX >= -10 && projectedX <= canvas.width + 10 &&
            projectedY >= -10 && projectedY <= canvas.height + 10) {
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, Math.min(projectedSize, 4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(star.opacity * twinkle * scale * 0.3, 1)})`;
          ctx.fill();
        }
        
        star.distance += star.speed * 0.25;
      });

      // Draw and animate asteroids (gravitating towards screen)
      asteroids.forEach(asteroid => {
        asteroid.z -= asteroid.speed * 0.75;
        asteroid.rotation += asteroid.rotationSpeed;
        
        if (asteroid.z <= 50) {
          asteroid.z = 800;
          asteroid.angle = Math.random() * Math.PI * 2;
          asteroid.distance = Math.random() * 100;
        }
        
        const scale = 800 / asteroid.z;
        asteroid.x = centerX + Math.cos(asteroid.angle) * asteroid.distance * scale;
        asteroid.y = centerY + Math.sin(asteroid.angle) * asteroid.distance * scale;
        asteroid.distance += asteroid.speed * 0.15;
        
        if (asteroid.x >= -50 && asteroid.x <= canvas.width + 50 &&
            asteroid.y >= -50 && asteroid.y <= canvas.height + 50) {
          drawAsteroid(asteroid, Math.min(scale, 3));
        }
      });

      // Draw floating code snippets (gravitating towards screen)
      codeElements.forEach(code => {
        code.z -= code.speed * 0.5;
        
        if (code.z <= 50) {
          code.z = 800;
          code.angle = Math.random() * Math.PI * 2;
          code.distance = Math.random() * 100;
          code.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
          code.color = CODE_COLORS[Math.floor(Math.random() * CODE_COLORS.length)];
        }
        
        const scale = 600 / code.z;
        const projectedX = centerX + Math.cos(code.angle) * code.distance * scale;
        const projectedY = centerY + Math.sin(code.angle) * code.distance * scale;
        code.distance += code.speed * 0.2;
        
        if (projectedX >= -100 && projectedX <= canvas.width + 100 &&
            projectedY >= -50 && projectedY <= canvas.height + 50) {
          ctx.save();
          ctx.font = `${code.size * Math.min(scale, 2)}px 'Courier New', monospace`;
          const opacity = Math.min(code.opacity * scale * 0.5, 0.8);
          ctx.fillStyle = `rgba(${code.color.r}, ${code.color.g}, ${code.color.b}, ${opacity})`;
          ctx.fillText(code.text, projectedX, projectedY);
          ctx.restore();
        }
      });

      // Draw floating planets with unique spinning textures (gravitating effect)
      planets.forEach(planet => {
        const scale = 1 + Math.sin(time * 0.3 + planet.phase) * 0.1;
        // Slowly move planets towards screen center over time
        const gravitateFactor = Math.sin(time * 0.2 + planet.phase) * 0.02;
        planet.x = planet.baseX + (centerX - planet.baseX) * gravitateFactor;
        planet.y = planet.baseY + (centerY - planet.baseY) * gravitateFactor;
        
        drawPlanet(planet, time, scale);
      });

      // Draw tech icons with enhanced movement
      techIcons.forEach(icon => {
        const floatY = Math.sin(time * icon.speed + icon.phase) * 25;
        const floatX = Math.cos(time * icon.speed * 0.7 + icon.phase) * 15;
        
        // Gravitate towards center
        icon.z -= 0.3;
        if (icon.z <= 200) icon.z = 800;
        
        const scale = 600 / icon.z;
        const currentX = icon.x + floatX + (centerX - icon.x) * (1 - scale) * 0.1;
        const currentY = icon.y + floatY + (centerY - icon.y) * (1 - scale) * 0.1;
        const opacity = 0.4 + Math.sin(time + icon.phase) * 0.15;
        const currentSize = icon.size * Math.min(scale, 1.5);

        if (icon.type === 'robot' && robotImageRef.current && robotImageRef.current.complete) {
          ctx.save();
          ctx.globalAlpha = opacity;
          const imgSize = currentSize;
          ctx.drawImage(robotImageRef.current, currentX - imgSize/2, currentY - imgSize/2, imgSize, imgSize);
          ctx.restore();
        } else if (icon.type === 'gear') {
          icon.rotation = (icon.rotation || 0) + deltaTime * 0.8;
          drawGear(currentX, currentY, currentSize, icon.rotation, opacity);
        } else if (icon.type === 'brackets') {
          drawBrackets(currentX, currentY, currentSize, opacity);
        } else if (icon.type === 'binary') {
          drawBinary(currentX, currentY, currentSize, opacity, time);
        } else if (icon.type === 'circuit') {
          drawCircuit(currentX, currentY, currentSize, opacity, time);
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Show loading bar after card transforms
    setTimeout(() => {
      setShowLoadingBar(true);
    }, 400);
    
    // Navigate after full animation sequence completes
    setTimeout(() => {
      window.location.href = `${API_URL}/auth/login`;
    }, 1500);
  };

  return (
    <div className={`login-page-fullscreen ${isTransitioning ? 'transitioning-out' : ''}`}>
      <SpaceBackground />
      {!showLoadingBar ? (
        <div className={`login-container ${isTransitioning ? 'morphing-to-bar' : ''}`}>
          <h1 className="login-title">
            <span className="title-bracket">&lt;</span>
            Welcome to Quiz-App
            <span className="title-bracket">/&gt;</span>
          </h1>
          <p className="login-subtitle">
            Level up your coding skills! Take interactive quizzes on Python, Java, and more.
          </p>
          
          <a 
            href={`${API_URL}/auth/login`} 
            className={`github-login-btn ${isTransitioning ? 'clicked' : ''}`}
            onClick={handleLoginClick}
          >
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
      ) : (
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
