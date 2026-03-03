/**
 * script.js — Ofyue 全局交互脚本
 * 墨韵动效 · 视差背景 · 水墨粒子
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. LOADING SCREEN
    // =============================================
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
            }, 1600);
        });
        // Fallback: remove after 3s anyway
        setTimeout(() => loadingScreen.classList.add('loaded'), 3000);
    }

    // =============================================
    // 2. SMOOTH SCROLL (anchor links)
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // 3. SCROLL PARALLAX FOR BG + PROGRESS
    // =============================================
    let lastScrollY = 0;
    let rafId = null;

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1);

        // Background pan (panorama slides from 0% to 60% as user scrolls)
        document.documentElement.style.setProperty('--scroll-x', (progress * 60) + '%');

        // Reading progress bar
        const bar = document.getElementById('reading-progress');
        if (bar) bar.style.width = (progress * 100) + '%';

        lastScrollY = scrollTop;
        rafId = null;
    }

    window.addEventListener('scroll', () => {
        if (!rafId) rafId = requestAnimationFrame(onScroll);
    }, { passive: true });

    // =============================================
    // 4. INTERSECTION OBSERVER (slide-up reveal)
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.slide-up').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transitionDelay = (i * 0.08) + 's';
        revealObserver.observe(el);
    });

    // =============================================
    // 5. INK HOVER EFFECT ON BUTTONS
    // =============================================
    function attachInkFollow(selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                btn.style.setProperty('--x', (e.clientX - r.left) + 'px');
                btn.style.setProperty('--y', (e.clientY - r.top) + 'px');
            });
        });
    }
    attachInkFollow('.ink-btn');

    // =============================================
    // 6. CLICK INK SPLASH EFFECT
    // =============================================
    let lastClick = 0;
    const COOLDOWN = 700;

    document.addEventListener('click', e => {
        const now = Date.now();
        if (now - lastClick < COOLDOWN) return;
        lastClick = now;

        // Don't trigger on buttons/links
        if (e.target.closest('a, button, input, select, textarea')) return;

        const drop = document.createElement('div');
        drop.className = 'ink-drop';
        drop.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:10px;height:10px;`;
        document.body.appendChild(drop);

        const finalSize = 45 + Math.random() * 30;
        const start = Date.now();
        const dur = 1100;

        function animate() {
            const p = Math.min((Date.now() - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const size = 10 + (finalSize - 10) * ease;
            const ca = 0.85 * (1 - p);
            const ea = 0.5 * (1 - p);
            drop.style.width = size + 'px';
            drop.style.height = size + 'px';
            drop.style.background = `radial-gradient(circle, rgba(0,0,0,${ca}) 0%, rgba(20,20,20,${ca * 0.7}) 45%, rgba(0,0,0,${ea}) 75%, transparent 100%)`;
            if (p < 1) requestAnimationFrame(animate);
            else drop.remove();
        }
        requestAnimationFrame(animate);
    });

    // =============================================
    // 7. INK PARTICLE CANVAS
    // =============================================
    const canvas = document.getElementById('ink-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.r = Math.random() * 90 + 40;
                this.o = Math.random() * 0.042 + 0.012;
                this.grow = (Math.random() - 0.5) * 0.15;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.r = Math.max(20, this.r + this.grow);
                if (this.x < -this.r) this.x = W + this.r;
                if (this.x > W + this.r) this.x = -this.r;
                if (this.y < -this.r) this.y = H + this.r;
                if (this.y > H + this.r) this.y = -this.r;
            }
            draw() {
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
                g.addColorStop(0, `rgba(0,0,0,${this.o})`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.fillStyle = g;
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = [];
            const n = Math.floor((W * H) / 18000);
            for (let i = 0; i < n; i++) particles.push(new Particle());
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', init, { passive: true });
        init();
        loop();
    }

});
