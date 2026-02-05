document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.slide-up');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        observer.observe(el);
    });

    // --- Button Ink Follow Effect ---
    const inkButtons = document.querySelectorAll('.nav-links a, .ink-btn');
    
    inkButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });

    // --- Scroll Parallax for Background ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        // Update CSS variable for scroll progress (0 to 1)
        // We use a slight dampening or range if needed, but 0-1 is standard.
        document.body.style.setProperty('--scroll-progress', scrollPercent);
    });

    // --- Click Ink Splash Effect (Refined Dynamic Gradient) ---
    let lastClickTime = 0;
    const CLICK_COOLDOWN = 800; // 0.8s cooldown

    document.addEventListener('click', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastClickTime < CLICK_COOLDOWN) {
            return; // Ignore clicks within cooldown
        }
        lastClickTime = currentTime;

        // --- Main Ink Drop ---
        const drop = document.createElement('div');
        drop.classList.add('ink-drop');
        drop.style.left = e.clientX + 'px';
        drop.style.top = e.clientY + 'px';
        
        // Initial random size
        const initialSize = 10;
        const finalSize = 50 + Math.random() * 35; // Reduced to ~1/3 size
        
        drop.style.width = initialSize + 'px';
        drop.style.height = initialSize + 'px';
        
        document.body.appendChild(drop);

        // Animate
        const startTime = Date.now();
        const duration = 1200; // Duration of spread

        function animateDrop() {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Ease out function for size
            const ease = 1 - Math.pow(1 - progress, 3);
            
            // Size logic
            const currentSize = initialSize + (finalSize - initialSize) * ease;
            drop.style.width = currentSize + 'px';
            drop.style.height = currentSize + 'px';

            // Dynamic Gradient Logic
            // As progress goes 0 -> 1:
            // Center Alpha: 0.9 -> 0.0 (Fades out completely)
            // Edge Alpha: 0.8 -> 0.0
            // We keep the center darker than edges initially, but everything fades out.
            
            const centerAlpha = 0.9 * (1 - progress); 
            const edgeAlpha = 0.6 * (1 - progress);
            
            // We create a gradient that is densest in the center-ish, and fades to edges
            drop.style.background = `radial-gradient(circle, 
                rgba(0,0,0,${centerAlpha}) 0%, 
                rgba(20,20,20,${centerAlpha * 0.8}) 40%, 
                rgba(0,0,0,${edgeAlpha}) 80%, 
                transparent 100%)`;

            if (progress < 1) {
                requestAnimationFrame(animateDrop);
            } else {
                drop.remove();
            }
        }
        
        requestAnimationFrame(animateDrop);
    });

    // --- Ink Canvas Animation ---
    const canvas = document.getElementById('ink-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class InkParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 100 + 50;
            this.baseSize = this.size;
            this.opacity = Math.random() * 0.05 + 0.02;
            this.growth = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.size += this.growth;

            // Bounce off edges (softly)
            if (this.x < -this.size) this.x = width + this.size;
            if (this.x > width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = height + this.size;
            if (this.y > height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `rgba(0, 0, 0, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor((width * height) / 15000); // Density based on screen size
        for (let i = 0; i < particleCount; i++) {
            particles.push(new InkParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Slight trail effect? No, clean clear looks better for "floating smoke"
        // actually, let's just clear
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
});
