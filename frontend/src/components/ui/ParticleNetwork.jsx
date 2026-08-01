import React, { useRef, useEffect } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Set canvas to parent container size
    const resizeCanvas = () => {
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (parent) observer.observe(parent);
    window.addEventListener('resize', resizeCanvas);

    // Particle initialization
    const particles = [];
    const refWidth = parent ? parent.clientWidth : window.innerWidth;
    const particleCount = Math.min(refWidth / 6, 200); // Scale count by screen size, increased density
    const connectionDistance = 180; // Increased connection distance

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2.5, // Faster speed
        vy: (Math.random() - 0.5) * 2.5,
        radius: Math.random() * 3 + 2, // Bigger dots
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles and lines
      particles.forEach((p, index) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Cyan glowing dot
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(6, 182, 212, 1)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - (distance / connectionDistance);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.7})`; // More opaque lines
            ctx.lineWidth = 1.5; // Thicker lines
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parent) observer.unobserve(parent);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-80 mix-blend-screen"
    />
  );
};

export default ParticleNetwork;
