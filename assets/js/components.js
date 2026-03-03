/**
 * components.js
 * Injects shared nav and footer HTML into every page.
 * To update nav/footer site-wide: edit only this file.
 */

// =============================================
// SHARED NAV HTML
// =============================================
const NAV_HTML = `
<svg style="position:absolute;width:0;height:0;pointer-events:none;" aria-hidden="true">
  <defs>
    <filter id="ink-spread-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="1"/>
    </filter>
    <filter id="brush-edge" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

<nav class="ink-nav" id="main-nav">
  <a href="/" class="logo nav-logo-link" id="nav-logo">
    <span class="logo-text">Ofyue</span>
    <span class="logo-seal">印</span>
  </a>
  <button class="nav-hamburger" id="nav-hamburger" aria-label="菜单">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links-list">
    <li><a href="/" class="nav-home-link">草堂</a></li>
    <li><a href="/#about">平生</a></li>
    <li><a href="/#works">所思所迹</a></li>
    <li><a href="/#contact">飞鸽</a></li>
    <li><a href="/list.html" class="nav-list-link">文稿</a></li>
  </ul>
</nav>
`;

// =============================================
// SHARED FOOTER HTML
// =============================================
const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-quote">
      <span class="footer-quote-text">" 我 即 作 品 "</span>
    </div>
    <div class="footer-links">
      <a href="https://github.com/aofenghanyue" target="_blank" rel="noopener">GitHub</a>
      <span class="footer-sep">·</span>
      <a href="mailto:1772155440@qq.com">Email</a>
      <span class="footer-sep">·</span>
      <a href="/list.html">文稿</a>
    </div>
    <p class="footer-copy">&copy; 2026 Ofyue. All Rights Reserved. <span class="seal">ofyue印</span></p>
  </div>
</footer>
`;

// =============================================
// COMPONENT INJECTION
// =============================================

/**
 * Detect the root path so nav links work from any depth.
 * e.g. articles/荒诞不羁/*.html needs "../../" prefix
 */
function getRootPath() {
  const path = window.location.pathname;
  // Count directory depth from root
  const depth = (path.match(/\//g) || []).length - 1;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

function injectNav() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  const root = getRootPath();
  let html = NAV_HTML
    .replace(/href="\//g, `href="${root}`)
    .replace(/src="\//g, `src="${root}`);
  placeholder.outerHTML = html;
  initNavBehavior();
}

function injectFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  const root = getRootPath();
  let html = FOOTER_HTML
    .replace(/href="\//g, `href="${root}`)
    .replace(/src="\//g, `src="${root}`);
  placeholder.outerHTML = html;
}

function initNavBehavior() {
  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const navList = document.getElementById('nav-links-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('nav-open');
      hamburger.classList.toggle('is-active');
    });
  }

  // Highlight active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace(/^\.\/|^\.\.\//, ''))) {
      // Only for non-home links
      if (link.getAttribute('href') !== '/' && link.getAttribute('href') !== './') {
        link.classList.add('nav-active');
      }
    }
  });

  // Scroll shrink effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    }
  }, { passive: true });

  // Mouse-follow ink effect on nav links
  document.querySelectorAll('.nav-links a').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      btn.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
});
