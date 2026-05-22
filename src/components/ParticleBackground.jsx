import React, { useRef, useEffect, useCallback } from 'react';

const COLORS = [
  'rgba(168,85,247,0.6)',
  'rgba(6,182,212,0.5)',
  'rgba(236,72,153,0.5)',
];

const LINE_DISTANCE = 120;
const MOUSE_REPEL_DISTANCE = 100;
const MOUSE_REPEL_FORCE = 0.8;

function createParticle(canvasWidth, canvasHeight) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(Math.random() * 0.4 + 0.1),
    color,
    opacity: Math.random(),
    opacityDirection: Math.random() > 0.5 ? 1 : -1,
    opacitySpeed: Math.random() * 0.008 + 0.002,
  };
}

export default function ParticleBackground({ particleCount = 80, className = '' }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(width, height));
    }
    particlesRef.current = particles;
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update opacity (fade in/out)
        p.opacity += p.opacityDirection * p.opacitySpeed;
        if (p.opacity >= 1) {
          p.opacity = 1;
          p.opacityDirection = -1;
        } else if (p.opacity <= 0.1) {
          p.opacity = 0.1;
          p.opacityDirection = 1;
        }

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distMouse = Math.sqrt(dx * dx + dy * dy);
        if (distMouse < MOUSE_REPEL_DISTANCE && distMouse > 0) {
          const force = (MOUSE_REPEL_DISTANCE - distMouse) / MOUSE_REPEL_DISTANCE * MOUSE_REPEL_FORCE;
          p.x += (dx / distMouse) * force;
          p.y += (dy / distMouse) * force;
        }

        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
      }

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_DISTANCE) {
            const lineOpacity = (1 - dist / LINE_DISTANCE) * 0.15 * Math.min(a.opacity, b.opacity);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(168,85,247,${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
