// Snow Orbs Particle Background Engine
// High-performance canvas animation simulating falling luminous snow orbs

class SnowOrbsBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Density: adjusted for screen size
    this.particleCount = window.innerWidth < 768 ? 48 : 85;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse interactivity
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Touch interactivity on mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Spawn particles
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle(true));
    }

    if (!this.isReducedMotion) {
      this.animate();
    } else {
      this.drawStatic();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createParticle(initial = false) {
    // Generate layered snow orbs with depth: small & faint in back, large & glowing in front
    const depth = Math.random();
    const radius = depth < 0.6 
      ? 1.2 + Math.random() * 1.8   // Small distant orbs
      : depth < 0.88 
        ? 3.0 + Math.random() * 2.2 // Medium orbs
        : 5.2 + Math.random() * 3.5; // Foreground glowing bokeh orbs

    return {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : -15,
      radius: radius,
      baseRadius: radius,
      speedY: 0.5 + Math.random() * 1.4 + (radius * 0.15),
      speedX: (Math.random() - 0.5) * 0.6,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: 0.01 + Math.random() * 0.02,
      opacity: depth < 0.6 
        ? 0.2 + Math.random() * 0.35 
        : depth < 0.88 
          ? 0.45 + Math.random() * 0.35 
          : 0.65 + Math.random() * 0.3,
      glowColor: depth > 0.7 
        ? (Math.random() > 0.4 ? 'rgba(180, 225, 255,' : 'rgba(215, 240, 255,')
        : 'rgba(255, 255, 255,'
    };
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural gentle snowfall drift
      p.angle += p.angleSpeed;
      p.x += Math.sin(p.angle) * 0.65 + p.speedX;
      p.y += p.speedY;

      // Gentle interactive deflection from cursor
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.5;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Wrap around edges seamlessly
      if (p.y > this.height + 20) {
        this.particles[i] = this.createParticle(false);
      }
      if (p.x < -20) p.x = this.width + 10;
      if (p.x > this.width + 20) p.x = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.radius > 3.0) {
        // Glowing luminous orb with soft radial gradient
        const gradient = this.ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2.4
        );
        gradient.addColorStop(0, `${p.glowColor}${p.opacity})`);
        gradient.addColorStop(0.35, `${p.glowColor}${p.opacity * 0.6})`);
        gradient.addColorStop(0.7, `${p.glowColor}${p.opacity * 0.15})`);
        gradient.addColorStop(1, 'rgba(180, 220, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Inner crisp core
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.opacity + 0.2)})`;
        this.ctx.fill();
      } else {
        // Standard falling snow particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.glowColor}${p.opacity})`;
        this.ctx.fill();
      }
    }
  }

  animate() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawStatic() {
    this.draw();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnowOrbsBackground('snow-canvas');
});
