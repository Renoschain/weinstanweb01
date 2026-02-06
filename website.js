/**
 * Weinstant Galaxy Dust Particle Animation
 * Creates a subtle, flowing galaxy dust effect from left to right
 */

class GalaxyParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        // Start from left edge
        this.x = -10;
        // Random Y position
        this.y = Math.random() * this.canvas.height;

        // Particle properties
        this.size = Math.random() * 2 + 1; // 1-3px
        this.speedX = Math.random() * 1.5 + 0.5; // 0.5-2px per frame (left to right)
        this.speedY = (Math.random() - 0.5) * 0.3; // Slight vertical drift
        this.opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8 opacity

        // Glow effect
        this.glowSize = this.size * 2;
    }

    update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Respawn when particle exits right edge
        if (this.x > this.canvas.width + 10) {
            this.reset();
        }

        // Keep particles within vertical bounds (with wrapping)
        if (this.y < 0) {
            this.y = this.canvas.height;
        } else if (this.y > this.canvas.height) {
            this.y = 0;
        }
    }

    draw(ctx) {
        // Draw glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.5})`;

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
    }
}

class GalaxyAnimation {
    constructor() {
        this.canvas = document.getElementById('galaxy-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];

        // Adjust particle count based on screen size
        this.particleCount = this.getParticleCount();

        // Initialize
        this.resize();
        this.createParticles();

        // Event listeners
        window.addEventListener('resize', () => this.resize());

        // Start animation
        this.animate();
    }

    getParticleCount() {
        const width = window.innerWidth;

        // Reduce particles on mobile for performance
        if (width < 480) return 30;
        if (width < 768) return 50;
        if (width < 1024) return 70;
        return 100;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Update particle count if screen size changed significantly
        const newCount = this.getParticleCount();
        if (newCount !== this.particleCount) {
            this.particleCount = newCount;
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const particle = new GalaxyParticle(this.canvas);

            // Distribute particles across the screen initially
            particle.x = Math.random() * this.canvas.width;

            this.particles.push(particle);
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GalaxyAnimation();
    });
} else {
    new GalaxyAnimation();
}

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Only handle internal links
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    const hamburger = document.querySelector('.hamburger-menu');
                    if (navLinks && hamburger) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Toggle active class
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        navLinks.addEventListener('click', (e) => {
            // Only close if clicking the overlay (not the links)
            if (e.target === navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on window resize if going to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Initialize Tokenomics Chart
    const tokenomicsCanvas = document.getElementById('tokenomicsChart');
    if (tokenomicsCanvas) {
        const ctx = tokenomicsCanvas.getContext('2d');

        // Create gradient colors
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, '#7C3AED');
        gradient1.addColorStop(1, '#6B46C1');

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, '#3B82F6');
        gradient2.addColorStop(1, '#1E40AF');

        const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient3.addColorStop(0, '#60A5FA');
        gradient3.addColorStop(1, '#3B82F6');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Public Sale / Community (85%)', 'Staking Rewards (5%)', 'Project Development (10%)'],
                datasets: [{
                    data: [85, 5, 10],
                    backgroundColor: [gradient1, gradient2, gradient3],
                    borderColor: ['#7C3AED', '#3B82F6', '#60A5FA'],
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#E5E7EB',
                            font: {
                                size: 14,
                                family: 'Inter, sans-serif',
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#E5E7EB',
                        borderColor: '#7C3AED',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
});
