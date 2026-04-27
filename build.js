const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Config ──────────────────────────────────────────────
const PROJECTS_DIR = './_projects';
const SITE_DIR = './_site';
const ASSETS_DIR = './assets';

const FONTS = `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap`;

// ── Shared CSS ───────────────────────────────────────────
const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --black: #080808; --dark: #111; --gray: #1A1A1A; --mid: #242424;
  --border: #2C2C2C; --text: #E4E4E4; --muted: #777; --yellow: #F5C518;
}
html { scroll-behavior: smooth; }
body {
  background: var(--black); color: var(--text);
  font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.75;
  overflow-x: hidden; -webkit-font-smoothing: antialiased;
}
body::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
}

/* ── Global link reset — removes all default blue browser styling ── */
a {
  color: inherit;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
a:visited { color: inherit; }
a:focus { outline: 2px solid var(--yellow); outline-offset: 3px; }
a:focus:not(:focus-visible) { outline: none; }

/* ── Nav ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 48px; display: flex; align-items: center; justify-content: space-between;
  background: rgba(8,8,8,0.85); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.nav-name {
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
  color: var(--text); text-decoration: none; transition: opacity 0.2s;
}
.nav-name:hover { opacity: 0.7; }
.nav-name:active { opacity: 0.5; }
.nav-name span { color: var(--yellow); }
.nav-back { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.02em; text-transform: none; color: var(--muted); text-decoration: none; transition: color 0.2s; }
.nav-back:hover { color: var(--yellow); }
.nav-back:active { color: var(--text); }
.nav-links { display: flex; gap: 36px; list-style: none; }
.nav-links a { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.01em; text-transform: none; color: var(--muted); text-decoration: none; transition: color 0.2s; padding-bottom: 2px; border-bottom: 1px solid transparent; }
.nav-links a:hover { color: var(--yellow); border-bottom-color: rgba(245,197,24,0.4); }
.nav-links a:active { color: var(--text); }

/* ── Project cards ── */
.project-card:active { background: #2E2E2E; border-left-color: var(--yellow); }
.project-card:active .project-arrow { background: var(--yellow); border-color: var(--yellow); color: var(--black); }
.project-card:visited { color: inherit; }

/* ── Nav proj (prev/next) ── */
.nav-proj:active { background: #2E2E2E; }
.nav-proj:visited { color: inherit; }
.nav-proj.right:active { background: #2E2E2E; }

/* ── Live links ── */
.live-link:visited { color: var(--accent, var(--yellow)); }
.live-link:active { opacity: 0.7; }

/* ── Contact button ── */
.contact-link:visited { color: var(--black); }
.contact-link:active { opacity: 0.8; transform: translateY(1px); }

/* ── Prose links (inside case study content) ── */
.prose a {
  color: var(--accent, var(--yellow));
  text-decoration: none;
  border-bottom: 1px solid rgba(245,197,24,0.25);
  transition: border-color 0.2s, color 0.2s;
}
.prose a:hover { border-bottom-color: var(--accent, var(--yellow)); }
.prose a:visited { color: var(--accent, var(--yellow)); opacity: 0.8; }
.prose a:active { opacity: 0.6; }

@media (max-width: 768px) {
  nav { padding: 16px 24px; }
  .nav-links { display: none; }
}
`;

// ── Ensure output directories ─────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Load home page content ────────────────────────────────
function loadHome() {
  const homePath = './home.md';
  if (!fs.existsSync(homePath)) return {};
  const raw = fs.readFileSync(homePath, 'utf8');
  const { data } = matter(raw);
  return data;
}

// ── Load and sort projects ────────────────────────────────
function loadProjects() {
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.md'));
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return { ...data, content, file };
    })
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

// ── Render markdown content ───────────────────────────────
function renderContent(md) {
  return marked(md);
}

// ── Build homepage ────────────────────────────────────────
function buildIndex(projects, home) {
  const name = home.name || 'Venu Sri Sabbavarapu';
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  const jobTitle = home.title || 'Product Manager & UX Lead';
  const tagline = home.tagline || '';
  const email = home.email || 'hello@example.com';
  const location = home.location || 'United States';
  const patent = home.patent || '';
  const industries = home.industries || '';
  const contactHeadline = home.contact_headline || "Let's work together.";
  const aboutHeadline = home.about_headline || 'About';
  const aboutBody = (home.about_body || '').split('\\n\\n').map(p => `<p>${p}</p>`).join('');
  const skillsProduct = (home.skills_product || '').split(',').map(s => `<li>${s.trim()}</li>`).join('');
  const skillsDesign = (home.skills_design || '').split(',').map(s => `<li>${s.trim()}</li>`).join('');
  const skillsResearch = (home.skills_research || '').split(',').map(s => `<li>${s.trim()}</li>`).join('');
  const skillsDomain = (home.skills_domain || '').split(',').map(s => `<li>${s.trim()}</li>`).join('');
  const footerNote = home.footer_note || '';

  const cards = projects.filter(p => p.featured !== false).map((p, i) => {
    const accent = p.accent || '#F5C518';
    const tags = (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : p.tags || []);
    return `
    <a class="project-card" href="${p.slug}.html" style="--card-accent:${accent};">
      <div class="project-num">0${i + 1}</div>
      <div class="project-body">
        <div class="project-tags">
          ${tags.map((t, ti) => `<span class="tag${ti === 0 ? ' highlight' : ''}">${t}</span>`).join('')}
        </div>
        <h2>${p.title}</h2>
        <p>${p.summary || ''}</p>
      </div>
      <div class="project-arrow">→</div>
    </a>
  `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — ${jobTitle}</title>
<link href="${FONTS}" rel="stylesheet">
<style>
${BASE_CSS}

.hero {
  min-height: 100vh; display: flex; align-items: center;
  padding: 120px 48px 80px; position: relative; overflow: hidden;
}
.hero-bg {
  position: absolute; right: -60px; bottom: -40px;
  font-family: 'Space Grotesk', sans-serif; font-size: 28vw; font-weight: 700;
  color: rgba(245,197,24,0.025); pointer-events: none; line-height: 1;
  letter-spacing: -0.05em; user-select: none;
}
.hero-inner { max-width: 1100px; margin: 0 auto; width: 100%; }
.hero-tag {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--yellow);
  margin-bottom: 32px; animation: fadeUp 0.7s 0.1s ease both;
}
.hero-tag::before { content: ''; display: block; width: 24px; height: 1px; background: var(--yellow); }
.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(48px, 7vw, 96px); font-weight: 700;
  line-height: 0.95; letter-spacing: -0.04em; margin-bottom: 40px;
  animation: fadeUp 0.7s 0.2s ease both;
}
.hero h1 .accent { color: var(--yellow); display: block; }
.hero-desc {
  max-width: 520px; font-size: 18px; font-weight: 300; color: #999;
  line-height: 1.65; margin-bottom: 56px; animation: fadeUp 0.7s 0.3s ease both;
}
.hero-stats { display: flex; gap: 48px; flex-wrap: wrap; animation: fadeUp 0.7s 0.4s ease both; }
.hero-stat label {
  display: block; font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--yellow);
  font-weight: 700; margin-bottom: 4px;
}
.hero-stat span { font-size: 14px; color: var(--text); }

.work { padding: 120px 48px; max-width: 1100px; margin: 0 auto; }
.section-header {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 64px; border-bottom: 1px solid var(--border); padding-bottom: 20px;
}
.section-label {
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--yellow);
}
.section-count { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); }
.projects { display: flex; flex-direction: column; gap: 2px; }
.project-card {
  display: grid; grid-template-columns: 80px 1fr auto;
  align-items: start; gap: 32px; padding: 40px;
  background: var(--gray); text-decoration: none; color: inherit;
  position: relative; overflow: hidden;
  transition: background 0.3s, border-left-color 0.3s;
  border-left: 3px solid transparent;
}
.project-card::before {
  content: ''; position: absolute; inset: 0;
  background: var(--card-accent, var(--yellow));
  opacity: 0; transition: opacity 0.3s;
}
.project-card:hover {
  background: var(--mid);
  border-left-color: var(--card-accent, var(--yellow));
}
.project-card:hover::before { opacity: 0.04; }
.project-card:active {
  background: #2A2A2A;
  border-left-color: var(--card-accent, var(--yellow));
}
.project-num {
  font-family: 'Space Grotesk', sans-serif; font-size: 48px; font-weight: 700;
  color: rgba(255,255,255,0.05); line-height: 1; padding-top: 4px; transition: color 0.3s;
}
.project-card:hover .project-num { color: var(--card-accent, var(--yellow)); opacity: 0.2; }
.project-body { position: relative; z-index: 1; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.tag {
  font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 10px;
  background: var(--mid); border: 1px solid var(--border); color: var(--muted);
}
.tag.highlight {
  background: transparent;
  border-color: var(--card-accent, var(--yellow));
  color: var(--card-accent, var(--yellow));
  opacity: 0.85;
}
.project-body h2 {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px;
}
.project-body p { font-size: 15px; color: var(--muted); max-width: 560px; margin-bottom: 0; }
.project-arrow {
  width: 48px; height: 48px; border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted); font-size: 20px; transition: all 0.3s; flex-shrink: 0; margin-top: 8px;
  position: relative; z-index: 1;
}
.project-card:hover .project-arrow { background: var(--card-accent, var(--yellow)); border-color: var(--card-accent, var(--yellow)); color: var(--black); }

.about { padding: 120px 48px; border-top: 1px solid var(--border); }
.about-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
.about h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 4vw, 52px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 32px; }
.about h2 span { color: var(--yellow); }
.about p { font-size: 16px; color: #999; margin-bottom: 20px; }
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
.skill-block { background: var(--gray); padding: 24px; }
.skill-block label { display: block; font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--yellow); margin-bottom: 10px; }
.skill-block ul { list-style: none; }
.skill-block li { font-size: 13px; color: var(--muted); padding: 4px 0; border-bottom: 1px solid var(--border); }
.skill-block li:last-child { border-bottom: none; }

.contact { padding: 100px 48px; border-top: 1px solid var(--border); text-align: center; }
.contact-inner { max-width: 600px; margin: 0 auto; }
.contact .pre { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--yellow); margin-bottom: 20px; }
.contact h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 5vw, 56px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 32px; }
.contact-link { display: inline-block; font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--black); background: var(--yellow); padding: 16px 36px; text-decoration: none; transition: opacity 0.2s; }
.contact-link:hover { opacity: 0.85; }

footer { padding: 32px 48px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
footer p { font-size: 12px; color: var(--muted); margin-bottom: 0; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .hero { padding: 100px 24px 60px; }
  .hero-bg { display: none; }
  .work { padding: 80px 24px; }
  .project-card { grid-template-columns: 1fr; gap: 16px; padding: 28px 24px; }
  .project-num { font-size: 32px; }
  .project-arrow { display: none; }
  .about { padding: 80px 24px; }
  .about-inner { grid-template-columns: 1fr; gap: 48px; }
  .skills-grid { grid-template-columns: 1fr; }
  .contact { padding: 80px 24px; }
  footer { padding: 24px; flex-direction: column; gap: 8px; text-align: center; }
}
</style>
</head>
<body>

<nav>
  <a class="nav-name" href="index.html">${firstName}<span>.</span></a>
    <li><a href="#work">Work</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<section class="hero">
  <div class="hero-bg">PM</div>
  <div class="hero-inner">
    <div class="hero-tag">${jobTitle}</div>
    <h1>${firstName}<span class="accent">${lastName}</span></h1>
    <p class="hero-desc">${tagline}</p>
    <div class="hero-stats">
      <div class="hero-stat"><label>Experience</label><span>UX Design + PM</span></div>
      ${patent ? `<div class="hero-stat"><label>Patent</label><span>${patent}</span></div>` : ''}
      ${industries ? `<div class="hero-stat"><label>Industries</label><span>${industries}</span></div>` : ''}
      ${location ? `<div class="hero-stat"><label>Based</label><span>${location}</span></div>` : ''}
    </div>
  </div>
</section>

<section class="work" id="work">
  <div class="section-header">
    <span class="section-label">Selected Work</span>
    <span class="section-count">0${projects.filter(p => p.featured !== false).length} Projects</span>
  </div>
  <div class="projects">${cards}</div>
</section>

<section class="about" id="about">
  <div class="about-inner">
    <div>
      <div class="section-label" style="margin-bottom:20px;">About</div>
      <h2>${aboutHeadline}</h2>
      ${aboutBody}
    </div>
    <div class="skills-grid">
      <div class="skill-block"><label>Product</label><ul>${skillsProduct}</ul></div>
      <div class="skill-block"><label>Design</label><ul>${skillsDesign}</ul></div>
      <div class="skill-block"><label>Research</label><ul>${skillsResearch}</ul></div>
      <div class="skill-block"><label>Domain</label><ul>${skillsDomain}</ul></div>
    </div>
  </div>
</section>

<section class="contact" id="contact">
  <div class="contact-inner">
    <p class="pre">Get in touch</p>
    <h2>${contactHeadline}</h2>
    <a class="contact-link" href="mailto:${email}">Send a message</a>
  </div>
</section>

<footer>
  <p>© 2026 ${name}</p>
  <p>${footerNote}</p>
</footer>

</body>
</html>`;
}

// ── Build individual case study page ─────────────────────
function buildCaseStudy(project, projects) {
  const accent = project.accent || '#F5C518';
  const idx = projects.findIndex(p => p.slug === project.slug);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];

  const liveLinks = (project.live_links || []).map(l =>
    `<a class="live-link" href="${l.url}" target="_blank">↗ ${l.label}</a>`
  ).join('');

  const metaFields = [
    project.company && ['Company', project.company],
    project.role && ['Role', project.role],
    project.domain && ['Domain', project.domain],
    project.patent && ['Patent', project.patent],
    project.filed && ['Filed', project.filed],
    project.year && ['Year', project.year],
    project.team && ['Team', project.team],
  ].filter(Boolean);

  const metaRow = metaFields.map(([label, val]) => `
    <div class="meta-item">
      <label>${label}</label>
      <span>${val}</span>
    </div>
  `).join('');

  const navLinks = [
    prev && `<a class="nav-proj" href="${prev.slug}.html"><span class="dir">← Previous</span><h4>${prev.title}</h4></a>`,
    next && `<a class="nav-proj right" href="${next.slug}.html"><span class="dir">Next →</span><h4>${next.title}</h4></a>`,
  ].filter(Boolean).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${project.title} — Venu Sri Sabbavarapu</title>
<link href="${FONTS}" rel="stylesheet">
<style>
${BASE_CSS}

:root { --accent: ${accent}; }

.case-hero { padding: 140px 48px 80px; max-width: 1000px; margin: 0 auto; }
.case-tag {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px;
}
.case-tag::before { content: ''; display: block; width: 24px; height: 1px; background: var(--accent); }
.case-hero h1 {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(36px, 6vw, 72px);
  font-weight: 700; letter-spacing: -0.03em; line-height: 1.0; margin-bottom: 28px;
}
.case-hero h1 span { color: var(--accent); }
.case-hero .subtitle { font-size: 19px; font-weight: 300; color: #999; max-width: 620px; line-height: 1.6; margin-bottom: 56px; }
.meta-row { display: flex; flex-wrap: wrap; border-top: 1px solid var(--border); border-left: 1px solid var(--border); }
.meta-item { flex: 1; min-width: 140px; padding: 20px 24px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.meta-item label { display: block; font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 6px; }
.meta-item span { font-size: 13px; color: var(--text); }

.case-body { max-width: 1000px; margin: 0 auto; padding: 0 48px 120px; }

/* Markdown content styles */
.prose { max-width: 720px; }
.prose h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 3vw, 36px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin: 64px 0 20px; padding-top: 64px; border-top: 1px solid var(--border); color: var(--text); }
.prose h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
.prose h3 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; margin: 32px 0 12px; color: var(--text); }
.prose h4 { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; margin: 24px 0 8px; color: var(--text); }
.prose p { font-size: 16px; color: #9A9A9A; margin-bottom: 18px; line-height: 1.75; }
.prose strong { color: var(--text); font-weight: 600; }
.prose em { font-style: italic; }
.prose ul, .prose ol { margin: 16px 0 20px 0; padding-left: 0; list-style: none; }
.prose li { font-size: 15px; color: #9A9A9A; padding: 6px 0 6px 20px; border-bottom: 1px solid var(--border); position: relative; }
.prose li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 12px; top: 8px; }
.prose li:last-child { border-bottom: none; }
.prose blockquote { background: var(--gray); border-left: 3px solid var(--accent); padding: 24px 28px; margin: 32px 0; font-size: 18px; font-weight: 300; font-style: italic; color: var(--text); line-height: 1.6; }
.prose blockquote p { color: var(--text); margin-bottom: 0; font-size: 18px; }
.prose table { width: 100%; border-collapse: collapse; margin: 32px 0; }
.prose th { font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); background: var(--gray); padding: 12px 16px; text-align: left; border: 1px solid var(--border); }
.prose td { font-size: 14px; color: #9A9A9A; padding: 12px 16px; border: 1px solid var(--border); background: var(--dark); }
.prose tr:hover td { background: var(--gray); }
.prose hr { border: none; border-top: 1px solid var(--border); margin: 48px 0; }
.prose code { font-family: 'Space Mono', monospace; font-size: 12px; background: var(--gray); padding: 2px 6px; color: var(--accent); }

.live-link {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
  text-decoration: none; border: 1px solid rgba(255,255,255,0.1);
  padding: 10px 18px; transition: all 0.2s; margin: 8px 8px 32px 0; width: fit-content;
}
.live-link:hover { background: rgba(255,255,255,0.05); border-color: var(--accent); }

.cover-img { width: 100%; display: block; margin: 40px 0; border: 1px solid var(--border); }

.next-prev { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 80px; }
.nav-proj { background: var(--gray); padding: 32px; text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 8px; transition: background 0.2s; border-left: 3px solid transparent; }
.nav-proj:hover { background: var(--mid); border-left-color: var(--yellow); }
.nav-proj .dir { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.nav-proj h4 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); }
.nav-proj.right { text-align: right; border-left: none; border-right: 3px solid transparent; }
.nav-proj.right:hover { border-left: none; border-right-color: var(--yellow); }

@media (max-width: 768px) {
  .case-hero, .case-body { padding-left: 24px; padding-right: 24px; }
  .next-prev { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<nav>
  <a class="nav-name" href="index.html">Venu<span>.</span></a>
  <a class="nav-back" href="index.html">← All Work</a>
</nav>

<div class="case-hero">
  <div class="case-tag">Case Study 0${idx + 1} · ${project.company || ''}</div>
  <h1>${project.title.replace(' — ', '<br><span>').replace(/(<span>.*)/, '$1</span>')}</h1>
  <p class="subtitle">${project.summary || ''}</p>
  <div class="meta-row">${metaRow}</div>
</div>

<div class="case-body">
  ${liveLinks}
  ${project.cover ? `<img class="cover-img" src="${project.cover}" alt="${project.title} cover" />` : ''}
  <div class="prose">${renderContent(project.content)}</div>
  <div class="next-prev">${navLinks}</div>
</div>

</body>
</html>`;
}

// ── Main build ────────────────────────────────────────────
function build() {
  ensureDir(SITE_DIR);
  ensureDir(path.join(SITE_DIR, 'assets/images'));

  // Copy assets if they exist
  if (fs.existsSync(ASSETS_DIR)) {
    fs.cpSync(ASSETS_DIR, path.join(SITE_DIR, 'assets'), { recursive: true });
  }

  const projects = loadProjects();
  const home = loadHome();
  console.log(`Found ${projects.length} projects`);

  // Build homepage
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), buildIndex(projects, home));
  console.log('Built: index.html');

  // Build case study pages
  projects.forEach(project => {
    const html = buildCaseStudy(project, projects);
    fs.writeFileSync(path.join(SITE_DIR, `${project.slug}.html`), html);
    console.log(`Built: ${project.slug}.html`);
  });

  console.log(`\n✅ Site built to ./_site/ — ${projects.length + 1} pages`);
}

build();
