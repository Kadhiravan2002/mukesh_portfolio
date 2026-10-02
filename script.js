gsap.registerPlugin(ScrollTrigger);

/* ── LENIS SMOOTH SCROLL ───────────────── */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && typeof Lenis !== 'undefined') {
  window.__lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  const lenis = window.__lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    });
  });
}

/* ── NAV STICK ─────────────────────────── */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -40',
  onUpdate: self => nav.classList.toggle('is-stuck', self.scroll() > 40)
});

/* ── MOBILE MENU ───────────────────────── */
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');

function toggleMenu(force) {
  const open = force !== undefined
    ? force
    : burger.getAttribute('aria-expanded') !== 'true';

  burger.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);

  // pause/resume page scroll
  if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
}

burger?.addEventListener('click', () => toggleMenu());
document.querySelectorAll('[data-menu-link]').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);
// close with Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu(false);
});

/* ── HERO INTRO ────────────────────────── */
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.from('[data-hero="eyebrow"]', { y: 20, opacity: 0, duration: .7 })
  .from('.hero__name .line__in',  { yPercent: 110, duration: 1.05, ease: 'power4.out' }, '-=.35')
  .from('.hero__tag .line__in',   { yPercent: 110, duration: .9,  ease: 'power4.out' }, '-=.7')
  .from('[data-hero="sub"]',      { y: 22, opacity: 0, duration: .7 }, '-=.55')
  .from('[data-hero="actions"] .btn', { y: 18, opacity: 0, duration: .55, stagger: .09 }, '-=.45')
  .from('[data-hero="photo"]',    { y: 40, opacity: 0, scale: .96, duration: 1.1 }, '-=1.15')
  .from('.marquee',               { opacity: 0, duration: .8 }, '-=.6');

/* hero parallax on scroll */
if (!reduce) {
  gsap.to('.hero__inner', {
    yPercent: -8, opacity: .35, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero__glow', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ── SCROLL REVEALS ────────────────────── */
function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    gsap.set(el, { y: 28, opacity: 0 });
    gsap.to(el, {
      opacity: 1, y: 0, duration: .85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  ScrollTrigger.refresh();
}

initReveals();

/* ── SERVICES DATA ─────────────────────── */
const SERVICES = [
  {
    n: '01',
    t: 'Photography & Frames',
    d: 'Tell me what you need — a shoot, a print, a frame. I connect you with the right photographer from my local network and get it delivered. You just send the money and the details.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8a2 2 0 0 1 2-2h1.5l1-2h9l1 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/></svg>'
  },
  {
    n: '02',
    t: 'Travel Bookings',
    d: 'Bus, van, tempo traveller, tour packages — domestic trips sorted. Direct contacts with operators across the region, so you get a straight answer, not a runaround.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 13h18"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>'
  },
  {
    n: '03',
    t: 'Video Editing',
    d: 'Clean, quick edits for reels, shorts and short-form content. Fast turnaround, honest pricing, revisions included.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/></svg>'
  },
  {
    n: '04',
    t: 'Content & Reels',
    d: 'Cinema song edits, lyric reels, trending audio cuts — the kind of stuff I post on my own page every week. Same energy, made for your brand.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M8 20v-4M16 20v-4M10 20h4"/></svg>'
  }
];

const grid = document.getElementById('serviceGrid');
if (grid) {
  grid.innerHTML = SERVICES.map(s => `
    <article class="card" data-reveal data-tilt>
      <div class="card__head">
        <div class="card__icon">${s.icon}</div>
        <span class="card__n">${s.n}</span>
      </div>
      <h3 class="card__t">${s.t}</h3>
      <p class="card__d">${s.d}</p>
      <span class="card__more">
        Chat about this
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </span>
    </article>
  `).join('');
}

/* ── CARD CURSOR GLOW ──────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ═══════════════════════════════════════════
   PHASE 3 — REELS DATA
   ═══════════════════════════════════════════ */

const REELS = [
  {
    title: 'Cinema song edit — melody cut',
    tag: 'Cinema Edit',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80'
  },
  {
    title: 'Lyric reel — trending audio',
    tag: 'Lyric Reel',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'
  },
  {
    title: 'Slow motion transition',
    tag: 'Transition',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'
  },
  {
    title: 'Mass dialogue + bgm sync',
    tag: 'Cinema Edit',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80'
  },
  {
    title: 'Vibe edit — night aesthetic',
    tag: 'Aesthetic',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80'
  },
  {
    title: 'Beat drop transition',
    tag: 'Transition',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80'
  },
  {
    title: 'Trending audio cut — reel',
    tag: 'Trending',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=600&q=80'
  },
  {
    title: 'Cinema climax edit',
    tag: 'Cinema Edit',
    url: 'https://www.instagram.com/mukesh_vibes_fx',
    thumb: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80'
  }
];

const reelsGrid = document.getElementById('reelsGrid');
if (reelsGrid) {
  reelsGrid.innerHTML = REELS.map((r, i) => `
    <a href="${r.url}" target="_blank" rel="noopener"
       class="reel" data-reveal data-n="${String(i + 1).padStart(2, '0')}">
      <img class="reel__thumb" src="${r.thumb}" alt="${r.title}" loading="lazy" />
      <div class="reel__overlay"></div>
      <div class="reel__play">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div class="reel__meta">
        <div class="reel__title">${r.title}</div>
        <span class="reel__tag">${r.tag}</span>
      </div>
    </a>
  `).join('');
}

/* re-run reveals for dynamically injected cards + reels */
initReveals();

/* ═══════════════════════════════════════════
   3D TILT — HERO PHOTO
   ═══════════════════════════════════════════ */

(function initPhotoTilt(){
  if (reduce) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const frame = document.querySelector('.hero__photoFrame');
  if (!frame) return;

  const MAX = 14;   // max degrees
  const LERP = 0.12;

  let target = { rx: 0, ry: 0, sx: 50, sy: 50 };
  let current = { rx: 0, ry: 0 };
  let raf;

  function tick(){
    current.rx += (target.rx - current.rx) * LERP;
    current.ry += (target.ry - current.ry) * LERP;

    frame.style.transform =
      `rotateX(${current.rx}deg) rotateY(${current.ry}deg)`;
    frame.style.setProperty('--shine-x', target.sx + '%');
    frame.style.setProperty('--shine-y', target.sy + '%');

    if (Math.abs(current.rx - target.rx) > 0.01 ||
        Math.abs(current.ry - target.ry) > 0.01) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function kick(){
    if (!raf) raf = requestAnimationFrame(tick);
  }

  frame.addEventListener('mousemove', e => {
    const r = frame.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1

    target.ry = (px - 0.5) * 2 * MAX;
    target.rx = -(py - 0.5) * 2 * MAX;
    target.sx = px * 100;
    target.sy = py * 100;

    frame.classList.add('is-tilting');
    kick();
  });

  frame.addEventListener('mouseleave', () => {
    target.rx = 0; target.ry = 0;
    target.sx = 50; target.sy = 50;
    frame.classList.remove('is-tilting');
    kick();
  });
})();

/* ═══════════════════════════════════════════
   PHASE 4 — TESTIMONIALS DATA
   ═══════════════════════════════════════════ */

const TESTIMONIALS = [
  {
    text: "Mukesh handled our whole wedding shoot coordination. He found a photographer within our budget and got the frames delivered right to our home. Didn't have to chase anyone.",
    name: 'Arun K.',
    role: 'Wedding client · Kanchipuram',
    initial: 'A'
  },
  {
    text: "Booked a tempo traveller for our family trip to Yelagiri. He sorted everything — driver, timing, price. Simple and trustworthy. Will book again.",
    name: 'Priya S.',
    role: 'Travel booking · Cheyyar',
    initial: 'P'
  },
  {
    text: "Got reels edited for my small business page. Quick turnaround, and he understood exactly the vibe I wanted. Solid work for the price.",
    name: 'Vignesh M.',
    role: 'Reel editing · Vellore',
    initial: 'V'
  }
];

const tGrid = document.getElementById('tGrid');
if (tGrid) {
  tGrid.innerHTML = TESTIMONIALS.map(t => `
    <article class="tcard" data-reveal>
      <div class="tcard__quote">&ldquo;</div>
      <p class="tcard__text">${t.text}</p>
      <div class="tcard__who">
        <div class="tcard__avatar">${t.initial}</div>
        <div>
          <div class="tcard__name">${t.name}</div>
          <div class="tcard__role">${t.role}</div>
        </div>
      </div>
    </article>
  `).join('');
}

/* re-run reveals for dynamically injected cards + reels + testimonials */
initReveals();

/* ═══════════════════════════════════════════
   PHASE 5 — INTRO · CURSOR
   ═══════════════════════════════════════════ */

/* ── PAGE INTRO ────────────────────────── */
(function runIntro(){
  const intro = document.getElementById('intro');
  const bar   = document.getElementById('introBar');
  if (!intro) return;

  if (reduce) {
    intro.classList.add('is-done');
    return;
  }

  // freeze scroll during intro
  if (window.__lenis) window.__lenis.stop();

  const tl = gsap.timeline({
    onComplete: () => {
      intro.classList.add('is-done');
      if (window.__lenis) window.__lenis.start();
      // hide from a11y tree once done
      setTimeout(() => intro.setAttribute('aria-hidden', 'true'), 800);
    }
  });

  tl.from('.intro__mark', {
      y: 30, opacity: 0, duration: .7, ease: 'power3.out'
    })
    .to(bar, {
      width: '100%', duration: 1.1, ease: 'power2.inOut'
    }, '-=.3')
    .to('.intro__mark', {
      y: -20, opacity: 0, duration: .45, ease: 'power2.in'
    }, '+=.15')
    .to(intro, {
      opacity: 0, duration: .6, ease: 'power2.inOut'
    }, '-=.15');
})();

/* ── CUSTOM CURSOR ─────────────────────── */
(function initCursor(){
  if (reduce) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.body.classList.add('cursor-active');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  // smooth-lag the ring
  function tick(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // hover state on interactive elements
  const interactive = 'a, button, .card, .reel, .cbtn, .tcard, .stat, .hero__photoFrame';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    }
  });

  // hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
})();