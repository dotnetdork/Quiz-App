/**
 * AnimatedBackground Component
 * 
 * Provides subtle, theme-specific background animations for quiz pages.
 * Each theme creates a unique, non-distracting visual experience.
 */
import { useEffect, useRef } from 'react';

const AnimatedBackground = ({ theme = 'default' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let elements = [];
    let time = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    // Initialize elements based on theme
    const initElements = () => {
      elements = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000); // Fewer elements than login

      switch (theme) {
        case 'geometric':
          initGeometric(count);
          break;
        case 'spiral':
          initSpiral(count);
          break;
        case 'ocean':
          initOcean(count);
          break;
        case 'network':
          initNetwork(count);
          break;
        case 'coffee':
          initCoffee(count);
          break;
        case 'blocks':
          initBlocks(count);
          break;
        case 'circuit':
          initCircuit(count);
          break;
        case 'matrix':
          initMatrix(count);
          break;
        case 'gears':
          initGears(count);
          break;
        default:
          initDefault(count);
      }
    };

    // Theme: Abstract Geometric Shapes
    const initGeometric = (count) => {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 40 + 20,
          speed: (Math.random() * 0.3 + 0.1),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          shape: ['triangle', 'circle', 'square', 'pentagon'][Math.floor(Math.random() * 4)],
          color: ['#ef6c00', '#1a365d', '#4caf50', '#ff9800'][Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.15 + 0.05
        });
      }
    };

    // Theme: Spiral Patterns
    const initSpiral = (count) => {
      for (let i = 0; i < count; i++) {
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        elements.push({
          centerX,
          centerY,
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 100 + 50,
          speed: (Math.random() * 0.5 + 0.2),
          size: Math.random() * 15 + 5,
          color: ['#ef6c00', '#1a365d', '#4caf50'][Math.floor(Math.random() * 3)],
          opacity: Math.random() * 0.2 + 0.1
        });
      }
    };

    // Theme: Ocean with turtles and bubbles
    const initOcean = (count) => {
      for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.2 ? 'turtle' : 'bubble';
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          type,
          size: type === 'turtle' ? Math.random() * 30 + 20 : Math.random() * 20 + 5,
          speed: type === 'turtle' ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.4 + 0.2),
          direction: type === 'turtle' ? (Math.random() < 0.5 ? 1 : -1) : 0,
          bobAmount: Math.random() * 20 + 10,
          bobSpeed: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
          color: type === 'turtle' ? '#4caf50' : '#64b5f6',
          opacity: type === 'turtle' ? 0.2 : Math.random() * 0.15 + 0.05
        });
      }
    };

    // Theme: Network Graph
    const initNetwork = (count) => {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 12 + 4,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: ['#ef6c00', '#1a365d', '#4caf50'][Math.floor(Math.random() * 3)],
          opacity: 0.3,
          connections: []
        });
      }
    };

    // Theme: Coffee Beans and Steam
    const initCoffee = (count) => {
      for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.7 ? 'bean' : 'steam';
        elements.push({
          x: Math.random() * canvas.width,
          y: type === 'steam' ? canvas.height + Math.random() * 100 : Math.random() * canvas.height,
          type,
          size: type === 'bean' ? Math.random() * 20 + 10 : Math.random() * 15 + 5,
          speed: type === 'bean' ? (Math.random() * 0.2 + 0.1) : (Math.random() * 0.5 + 0.3),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: type === 'bean' ? (Math.random() - 0.5) * 0.02 : 0,
          wobble: type === 'steam' ? Math.random() * 2 + 1 : 0,
          color: type === 'bean' ? '#3e2723' : '#9e9e9e',
          opacity: type === 'bean' ? 0.2 : Math.random() * 0.1 + 0.05
        });
      }
    };

    // Theme: Building Blocks
    const initBlocks = (count) => {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * 200,
          size: Math.random() * 40 + 20,
          speed: (Math.random() * 0.2 + 0.15),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          color: ['#ef6c00', '#1a365d', '#4caf50', '#ff9800', '#2196f3'][Math.floor(Math.random() * 5)],
          opacity: 0.2,
          landed: false,
          landY: canvas.height + 100
        });
      }
    };

    // Theme: Circuit Board
    const initCircuit = (count) => {
      for (let i = 0; i < count; i++) {
        const isHorizontal = Math.random() < 0.5;
        elements.push({
          x1: isHorizontal ? 0 : Math.random() * canvas.width,
          y1: isHorizontal ? Math.random() * canvas.height : 0,
          length: Math.random() * 300 + 100,
          isHorizontal,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          color: ['#ef6c00', '#4caf50', '#2196f3'][Math.floor(Math.random() * 3)],
          opacity: 0.15,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    // Theme: Matrix Code
    const initMatrix = (count) => {
      const columns = Math.floor(canvas.width / 20);
      for (let i = 0; i < columns; i++) {
        elements.push({
          x: i * 20,
          y: Math.random() * canvas.height,
          speed: (Math.random() * 0.5 + 0.3),
          chars: Array(20).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
          opacity: Math.random() * 0.15 + 0.05
        });
      }
    };

    // Theme: Rotating Gears
    const initGears = (count) => {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 50 + 30,
          teeth: Math.floor(Math.random() * 8) + 8,
          rotation: Math.random() * Math.PI * 2,
          speed: (Math.random() - 0.5) * 0.01,
          color: ['#616161', '#757575', '#9e9e9e'][Math.floor(Math.random() * 3)],
          opacity: 0.15
        });
      }
    };

    // Default theme
    const initDefault = (count) => {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: (Math.random() * 0.2 + 0.1),
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    };

    // Draw functions for each shape
    const drawTriangle = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPentagon = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * size / 2;
        const py = Math.sin(angle) * size / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawTurtle = (ctx, x, y, size, direction) => {
      ctx.save();
      ctx.translate(x, y);
      if (direction < 0) ctx.scale(-1, 1);
      
      // Shell
      ctx.fillStyle = ctx.fillStyle;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Head
      ctx.beginPath();
      ctx.ellipse(size * 0.5, 0, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Flippers
      ctx.beginPath();
      ctx.ellipse(-size * 0.3, size * 0.3, size * 0.15, size * 0.08, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-size * 0.3, -size * 0.3, size * 0.15, size * 0.08, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const drawGear = (ctx, x, y, size, teeth, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const outerRadius = size / 2;
      const innerRadius = outerRadius * 0.6;
      const toothHeight = outerRadius * 0.2;
      
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle = (i * 2 * Math.PI) / teeth;
        const nextAngle = ((i + 1) * 2 * Math.PI) / teeth;
        
        // Tooth outer edge
        ctx.lineTo(
          Math.cos(angle) * (outerRadius + toothHeight),
          Math.sin(angle) * (outerRadius + toothHeight)
        );
        ctx.lineTo(
          Math.cos(angle + (nextAngle - angle) * 0.4) * (outerRadius + toothHeight),
          Math.sin(angle + (nextAngle - angle) * 0.4) * (outerRadius + toothHeight)
        );
        
        // Tooth inner edge
        ctx.lineTo(
          Math.cos(angle + (nextAngle - angle) * 0.4) * outerRadius,
          Math.sin(angle + (nextAngle - angle) * 0.4) * outerRadius
        );
        ctx.lineTo(
          Math.cos(nextAngle - (nextAngle - angle) * 0.4) * outerRadius,
          Math.sin(nextAngle - (nextAngle - angle) * 0.4) * outerRadius
        );
        
        ctx.lineTo(
          Math.cos(nextAngle - (nextAngle - angle) * 0.4) * (outerRadius + toothHeight),
          Math.sin(nextAngle - (nextAngle - angle) * 0.4) * (outerRadius + toothHeight)
        );
      }
      ctx.closePath();
      ctx.fill();
      
      // Center hole
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016; // ~60fps

      switch (theme) {
        case 'geometric':
          animateGeometric();
          break;
        case 'spiral':
          animateSpiral();
          break;
        case 'ocean':
          animateOcean();
          break;
        case 'network':
          animateNetwork();
          break;
        case 'coffee':
          animateCoffee();
          break;
        case 'blocks':
          animateBlocks();
          break;
        case 'circuit':
          animateCircuit();
          break;
        case 'matrix':
          animateMatrix();
          break;
        case 'gears':
          animateGears();
          break;
        default:
          animateDefault();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const animateGeometric = () => {
      elements.forEach((el) => {
        el.y += el.speed;
        el.rotation += el.rotationSpeed;
        
        if (el.y > canvas.height + el.size) {
          el.y = -el.size;
          el.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = el.color;

        switch (el.shape) {
          case 'triangle':
            drawTriangle(ctx, el.x, el.y, el.size, el.rotation);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.rotate(el.rotation);
            ctx.fillRect(-el.size / 2, -el.size / 2, el.size, el.size);
            ctx.restore();
            break;
          case 'pentagon':
            drawPentagon(ctx, el.x, el.y, el.size, el.rotation);
            break;
        }
      });
      ctx.globalAlpha = 1;
    };

    const animateSpiral = () => {
      elements.forEach((el) => {
        el.angle += el.speed * 0.01;
        const x = el.centerX + Math.cos(el.angle) * el.radius;
        const y = el.centerY + Math.sin(el.angle) * el.radius;

        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(x, y, el.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const animateOcean = () => {
      elements.forEach((el) => {
        if (el.type === 'turtle') {
          el.x += el.speed * el.direction;
          el.y += Math.sin(time * el.bobSpeed + el.phase) * 0.2;
          
          if (el.x > canvas.width + el.size || el.x < -el.size) {
            el.x = el.direction > 0 ? -el.size : canvas.width + el.size;
            el.y = Math.random() * canvas.height;
          }

          ctx.globalAlpha = el.opacity;
          ctx.fillStyle = el.color;
          drawTurtle(ctx, el.x, el.y, el.size, el.direction);
        } else {
          // Bubble
          el.y -= el.speed;
          el.x += Math.sin(time * 2 + el.phase) * 0.3;
          
          if (el.y < -el.size) {
            el.y = canvas.height + el.size;
            el.x = Math.random() * canvas.width;
          }

          ctx.globalAlpha = el.opacity;
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    };

    const animateNetwork = () => {
      // Update positions
      elements.forEach((el) => {
        el.x += el.vx;
        el.y += el.vy;

        // Bounce off edges
        if (el.x < 0 || el.x > canvas.width) el.vx *= -1;
        if (el.y < 0 || el.y > canvas.height) el.vy *= -1;
      });

      // Draw connections
      ctx.strokeStyle = '#1a365d';
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const dx = elements[i].x - elements[j].x;
          const dy = elements[i].y - elements[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(elements[i].x, elements[i].y);
            ctx.lineTo(elements[j].x, elements[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      elements.forEach((el) => {
        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const animateCoffee = () => {
      elements.forEach((el) => {
        if (el.type === 'bean') {
          el.y += el.speed;
          el.rotation += el.rotationSpeed;
          
          if (el.y > canvas.height + el.size) {
            el.y = -el.size;
            el.x = Math.random() * canvas.width;
          }

          ctx.globalAlpha = el.opacity;
          ctx.fillStyle = el.color;
          ctx.save();
          ctx.translate(el.x, el.y);
          ctx.rotate(el.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, el.size / 2, el.size / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Steam
          el.y -= el.speed;
          el.x += Math.sin(time * el.wobble) * 0.5;
          el.opacity = Math.max(0, el.opacity - 0.002);
          
          if (el.y < -el.size || el.opacity <= 0) {
            el.y = canvas.height + el.size;
            el.x = Math.random() * canvas.width;
            el.opacity = Math.random() * 0.1 + 0.05;
          }

          ctx.globalAlpha = el.opacity;
          ctx.fillStyle = el.color;
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    };

    const animateBlocks = () => {
      elements.forEach((el) => {
        if (!el.landed) {
          el.y += el.speed;
          el.rotation += el.rotationSpeed;
          
          if (el.y > canvas.height + el.size) {
            el.y = -el.size;
            el.x = Math.random() * canvas.width;
          }
        }

        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = el.color;
        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.rotation);
        ctx.fillRect(-el.size / 2, -el.size / 2, el.size, el.size);
        
        // Add studs on top
        const studSize = el.size / 6;
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            ctx.beginPath();
            ctx.arc(
              -el.size / 4 + i * el.size / 2,
              -el.size / 4 + j * el.size / 2,
              studSize,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    };

    const animateCircuit = () => {
      elements.forEach((el) => {
        el.progress += el.speed;
        if (el.progress > 1) el.progress = 0;

        const pulseOpacity = el.opacity * (0.5 + 0.5 * Math.sin(time * el.pulseSpeed + el.pulsePhase));
        ctx.globalAlpha = pulseOpacity;
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        if (el.isHorizontal) {
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x1 + el.length * el.progress, el.y1);
        } else {
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x1, el.y1 + el.length * el.progress);
        }
        ctx.stroke();

        // Draw nodes at intersections
        if (Math.random() < 0.01) {
          ctx.fillStyle = el.color;
          ctx.globalAlpha = el.opacity * 1.5;
          const x = el.isHorizontal ? el.x1 + el.length * el.progress : el.x1;
          const y = el.isHorizontal ? el.y1 : el.y1 + el.length * el.progress;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    };

    const animateMatrix = () => {
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 0.05;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      elements.forEach((el) => {
        el.y += el.speed;
        
        if (el.y > canvas.height) {
          el.y = 0;
          el.chars = Array(20).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96));
        }

        ctx.fillStyle = '#4caf50';
        ctx.font = '14px monospace';
        
        el.chars.forEach((char, i) => {
          const charY = el.y - i * 20;
          if (charY > 0 && charY < canvas.height) {
            ctx.globalAlpha = el.opacity * (1 - i / el.chars.length);
            ctx.fillText(char, el.x, charY);
          }
        });
      });
      ctx.globalAlpha = 1;
    };

    const animateGears = () => {
      elements.forEach((el) => {
        el.rotation += el.speed;

        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = el.color;
        drawGear(ctx, el.x, el.y, el.size, el.teeth, el.rotation);
      });
      ctx.globalAlpha = 1;
    };

    const animateDefault = () => {
      elements.forEach((el) => {
        el.y += el.speed;
        
        if (el.y > canvas.height) {
          el.y = 0;
          el.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = el.opacity;
        ctx.fillStyle = '#1a365d';
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: '#fafafa'
      }}
    />
  );
};

export default AnimatedBackground;
