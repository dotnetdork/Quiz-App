/**
 * ClickParticles Component
 * 
 * Adds subtle particle effects emanating from button borders when users interact.
 * Non-intrusive and respects reduced motion preferences.
 * 
 * Performance optimizations:
 * - Only animates when particles exist
 * - Memoized to prevent unnecessary re-renders
 */
import { useEffect, useRef, useCallback, memo } from 'react';

const ClickParticles = memo(() => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const createParticles = useCallback((element) => {
    const rect = element.getBoundingClientRect();
    const particleCount = 10 + Math.floor(Math.random() * 6); // 10-15 particles
    const colors = ['#ef6c00', '#ff9800', '#4caf50', '#1a365d'];
    
    // Create particles along the border with more randomness
    for (let i = 0; i < particleCount; i++) {
      // Random position along perimeter (not evenly distributed)
      const perimeter = 2 * (rect.width + rect.height);
      const position = Math.random() * perimeter;
      
      let x, y, baseAngle;
      
      if (position < rect.width) {
        // Top edge
        x = rect.left + position + (Math.random() - 0.5) * 8;
        y = rect.top + (Math.random() - 0.5) * 3;
        baseAngle = -Math.PI / 2; // Up
      } else if (position < rect.width + rect.height) {
        // Right edge
        x = rect.right + (Math.random() - 0.5) * 3;
        y = rect.top + (position - rect.width) + (Math.random() - 0.5) * 8;
        baseAngle = 0; // Right
      } else if (position < 2 * rect.width + rect.height) {
        // Bottom edge
        x = rect.right - (position - rect.width - rect.height) + (Math.random() - 0.5) * 8;
        y = rect.bottom + (Math.random() - 0.5) * 3;
        baseAngle = Math.PI / 2; // Down
      } else {
        // Left edge
        x = rect.left + (Math.random() - 0.5) * 3;
        y = rect.bottom - (position - 2 * rect.width - rect.height) + (Math.random() - 0.5) * 8;
        baseAngle = Math.PI; // Left
      }
      
      // Add angle variance for organic spread
      const angleVariance = (Math.random() - 0.5) * 1.2; // ~70 degrees spread
      const angle = baseAngle + angleVariance;
      const speed = 0.08 + Math.random() * 0.15; // Variable speed
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.25 + Math.random() * 0.3,
        life: 1,
        decay: 0.006 + Math.random() * 0.01
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(particle => {
        // Slow, floaty movement - low gravity feel
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.002; // Very slight downward drift for floaty feel
        particle.vx *= 0.998; // Gentle friction
        particle.vy *= 0.998;
        particle.life -= particle.decay;
        particle.alpha = particle.life * 0.5; // Slight fade
        particle.size *= 0.998; // Very slow shrink

        if (particle.life > 0 && particle.size > 0.3) {
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      ctx.globalAlpha = 1;
      
      // Only continue animating if there are particles (performance optimization)
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
      }
    };
    
    // Start animation only when needed
    const startAnimation = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const handleClick = (e) => {
      // Find the interactive element
      const target = e.target;
      const interactiveElement = 
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.btn-primary') ||
        target.closest('.btn-secondary') ||
        target.closest('.btn-success') ||
        target.closest('.option') ||
        target.closest('.category-card') ||
        target.closest('.quiz-card') ||
        target.closest('.tab-button');

      if (interactiveElement) {
        createParticles(interactiveElement);
        startAnimation(); // Start animation when particles are created
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('click', handleClick);
    // Don't start animation loop - it will start on first click

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
});

export default ClickParticles;
