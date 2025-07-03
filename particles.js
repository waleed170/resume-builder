// particles.js - live particle background with connecting lines

(function() {
  const PARTICLE_COLOR_LIGHT = "rgba(0,123,255,0.7)";
  const PARTICLE_COLOR_DARK = "rgba(13,110,253,0.7)";
  const LINE_COLOR_LIGHT = "rgba(0,123,255,0.2)";
  const LINE_COLOR_DARK = "rgba(13,110,253,0.2)";
  const PARTICLE_COUNT = 75;
  const PARTICLE_RADIUS = 2.2;
  const LINE_DIST = 120;
  const PARTICLE_SPEED = 0.6;

  let canvas, ctx, particles = [], animationId;
  let width, height;
  let lastTheme = null;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED
      });
    }
  }

  function drawParticles() {
    const theme = getTheme();
    const pColor = theme === 'dark' ? PARTICLE_COLOR_DARK : PARTICLE_COLOR_LIGHT;
    const lColor = theme === 'dark' ? LINE_COLOR_DARK : LINE_COLOR_LIGHT;

    ctx.clearRect(0, 0, width, height);

    // draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = lColor;
          ctx.lineWidth = 1.2 - dist / LINE_DIST;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for (let i = 0; i < particles.length; i++) {
      ctx.beginPath();
      ctx.arc(particles[i].x, particles[i].y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = pColor;
      ctx.shadowColor = pColor;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy;

      // bounce on the edges
      if (particles[i].x < 0 || particles[i].x > width) particles[i].vx *= -1;
      if (particles[i].y < 0 || particles[i].y > height) particles[i].vy *= -1;
      // clamp to stay in bounds
      particles[i].x = Math.max(0, Math.min(width, particles[i].x));
      particles[i].y = Math.max(0, Math.min(height, particles[i].y));
    }
  }

  function animate() {
    drawParticles();
    updateParticles();
    animationId = requestAnimationFrame(animate);
  }

  function restart() {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    createParticles();
    animate();
  }

  function setup() {
    let bg = document.getElementById('particle-bg');
    if (!bg) {
      bg = document.createElement('div');
      bg.id = "particle-bg";
      document.body.insertBefore(bg, document.body.firstChild);
    }
    if (!bg.querySelector('canvas')) {
      canvas = document.createElement('canvas');
      canvas.style.display = "block";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.zIndex = "0";
      canvas.style.pointerEvents = "none";
      bg.appendChild(canvas);
    } else {
      canvas = bg.querySelector('canvas');
    }
    ctx = canvas.getContext('2d');

    resizeCanvas();
    createParticles();
    animate();
  }

  window.addEventListener('resize', () => {
    restart();
  });

  // Listen for theme changes
  const themeObserver = new MutationObserver(() => {
    const theme = getTheme();
    if (theme !== lastTheme) {
      lastTheme = theme;
      // Redraw with new theme
      drawParticles();
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  document.addEventListener('DOMContentLoaded', setup);
})();