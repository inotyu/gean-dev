
// ── STARS
(function(){
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // create stars
  for(let i = 0; i < 120; i++){
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.15 + 0.03,
      dir: Math.random() * Math.PI * 2
    });
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.x += Math.cos(s.dir) * s.speed;
      s.y += Math.sin(s.dir) * s.speed;
      if(s.x < 0) s.x = W;
      if(s.x > W) s.x = 0;
      if(s.y < 0) s.y = H;
      if(s.y > H) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${s.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── HEADER always visible (no show/hide)
const header = document.getElementById('site-header');
header.classList.add('visible');

// ── DEFAULT TIMELINE active node
const sIds = ['hero','about','skills','projects-section','experience','certificates','about-human','contact'];
const tlNodes = document.querySelectorAll('.tl-node');
const sObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const i = sIds.indexOf(e.target.id);
      tlNodes.forEach((n,j) => n.classList.toggle('active', i===j));
    }
  });
}, {threshold:.35});
sIds.forEach(id => { const el=document.getElementById(id); if(el) sObs.observe(el); });
tlNodes.forEach(n => n.addEventListener('click', () => document.getElementById(n.dataset.section)?.scrollIntoView({behavior:'smooth'})));

// ── MENU
const menuBtn = document.getElementById('menu-btn');
const dd = document.getElementById('dropdown');
menuBtn.addEventListener('click', e => { e.stopPropagation(); dd.classList.toggle('open'); });
document.addEventListener('click', () => dd.classList.remove('open'));
dd.querySelectorAll('.nav-item').forEach(a => a.addEventListener('click', () => dd.classList.remove('open')));

// ── PROJECTS scroll-tracked header timeline
const projSection = document.getElementById('projects-section');
const projFill = document.getElementById('proj-line-fill');
const ptnNodes = document.querySelectorAll('.ptn');
const projCards = document.querySelectorAll('.proj-card[data-proj-idx]');
const N = projCards.length;

// switch header to project mode
const projModeObs = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    header.classList.add('proj-mode');
  } else {
    header.classList.remove('proj-mode');
    // reset timeline
    projFill.style.width = '0%';
    ptnNodes.forEach((n,i) => { n.classList.toggle('reached', false); n.classList.toggle('current', i===0); });
  }
}, {threshold:.05});
projModeObs.observe(projSection);

// scroll tracking inside projects section
function updateProjTimeline() {
  if (!header.classList.contains('proj-mode')) return;
  const secTop = projSection.getBoundingClientRect().top;
  const secH   = projSection.offsetHeight;
  const progress = Math.max(0, Math.min(1, -secTop / (secH - window.innerHeight)));

  // which card is most visible
  let current = 0;
  projCards.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    const mid = r.top + r.height/2;
    if (mid < window.innerHeight * .65) current = i;
  });

  // fill line proportionally
  const fillPct = N <= 1 ? 100 : (current / (N-1)) * 100;
  projFill.style.width = fillPct + '%';

  ptnNodes.forEach((n, i) => {
    n.classList.toggle('reached', i < current);
    n.classList.toggle('current', i === current);
  });
}

window.addEventListener('scroll', updateProjTimeline, {passive:true});
updateProjTimeline();

// exit button
document.getElementById('proj-exit-btn').addEventListener('click', () => {
  document.getElementById('experience').scrollIntoView({behavior:'smooth'});
});

// ptn click → scroll to card
ptnNodes.forEach((n, i) => {
  n.addEventListener('click', () => {
    projCards[i]?.scrollIntoView({behavior:'smooth', block:'center'});
  });
});

// ── FADE IN
const fiObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:.08});
document.querySelectorAll('.fi').forEach(el => fiObs.observe(el));
