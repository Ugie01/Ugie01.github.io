/* Build one concise print sheet per project from the live detail pages. */
(() => {
  const pages = document.querySelector('#print-pages');
  const status = document.querySelector('#print-status');
  if (location.protocol === 'file:') {
    location.replace('http://127.0.0.1:4173/print.html');
    return;
  }
  const root = new URL('./', location.href);
  const revision = Date.now().toString();
  let profileName = '', profilePosition = '';
  const node = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (text) el.textContent = text;
    return el;
  };
  const copy = (source, cls) => {
    const el = source.cloneNode(true);
    if (cls !== undefined) el.className = cls;
    return el;
  };
  const text = (doc, selector) => doc.querySelector(selector)?.textContent.trim() || '';

  async function readConfig() {
    const url = new URL('content/site-config.json', root);
    url.searchParams.set('pdf-revision', revision);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('포트폴리오 설정을 불러오지 못했습니다.');
    return response.json();
  }

  function applyTheme(theme = {}) {
    const values = {
      '--site-bg': theme.background,
      '--cream': theme.background,
      '--paper': theme.surface,
      '--ink': theme.text,
      '--muted': theme.muted,
      '--blue': theme.accent,
      '--line': theme.line,
      '--navy': theme.dark
    };
    Object.entries(values).forEach(([name, value]) => {
      if (/^#[0-9a-f]{6}$/i.test(value || '')) document.documentElement.style.setProperty(name, value);
    });
  }

  async function readPage(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`페이지를 불러오지 못했습니다: ${url.pathname}`);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    doc.querySelectorAll('[src], [href]').forEach(el => {
      for (const attr of ['src', 'href']) {
        if (el.hasAttribute(attr)) el.setAttribute(attr, new URL(el.getAttribute(attr), url).href);
      }
    });
    doc.querySelectorAll('img').forEach(img => {
      const src = new URL(img.src);
      src.searchParams.set('pdf-revision', revision);
      img.src = src.href;
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    return doc;
  }

  function sheet(title, cls) {
    const page = node('article', `pdf-sheet ${cls}`);
    const head = node('header', 'pdf-running-head');
    head.append(node('strong', '', 'Ugie / PORTFOLIO'), node('span', '', title));
    const body = node('div', 'pdf-body');
    const footer = node('footer', 'pdf-footer');
    footer.append(node('span', '', `${profileName} / ${profilePosition}`), node('span', 'pdf-page-number'));
    page.append(head, body, footer);
    pages.append(page);
    return body;
  }

  function profile(home) {
    const body = sheet('PROFILE / SKILLS', 'pdf-profile');
    const hero = node('div', 'pdf-profile-hero');
    const intro = node('section', 'pdf-intro-copy');
    const description = node('div', 'pdf-description');
    const descriptionLines = [...home.querySelectorAll('.hero-description span')];
    (descriptionLines.length ? descriptionLines : [home.querySelector('.hero-description')]).forEach(line => {
      description.append(node('p', '', line.textContent.trim()));
    });
    intro.append(node('p', 'pdf-kicker', text(home, '.hero .eyebrow')),
      node('h1', '', text(home, '.hero h1')),
      node('p', 'pdf-name-en', text(home, '.hero-name-en')),
      node('p', 'pdf-position', text(home, '.hero-position')),
      description);
    const facts = copy(home.querySelector('.profile-facts'), 'pdf-facts');
    const portrait = node('figure', 'pdf-portrait');
    portrait.append(copy(home.querySelector('.hero-portrait img')));
    const githubLabel = text(home, '.contact-links a').replace(/\s*↗\s*$/, '').replace(' - ', ' / ');
    const github = node('a', 'pdf-profile-link', githubLabel + ' ↗');
    github.href = home.querySelector('.nav-github').href;
    portrait.append(github);
    hero.append(intro, portrait);
    const skills = node('section', 'pdf-skills');
    home.querySelectorAll('.skill-group').forEach(group => {
      const item = node('article', 'pdf-skill');
      item.append(node('h2', '', text(group, 'h3')));
      [...group.querySelectorAll('p')].forEach(p => item.append(copy(p, p.classList.contains('skill-context') ? 'pdf-skill-context' : '')));
      skills.append(item);
    });
    body.append(hero, facts, skills);
  }

  function project({doc, href}) {
    const title = text(doc, 'h1');
    const body = sheet(title, `pdf-project detail-redesign detail-compact${doc.body.classList.contains('tracking-page') ? ' tracking-page' : ''}`);
    body.dataset.source = href;
    const heading = node('header', 'pdf-project-heading');
    const titleRow = node('div', 'pdf-title-row');
    titleRow.append(node('h1', '', title), node('span', 'pdf-status', text(doc, '.status')));
    const meta = copy(doc.querySelector('.detail-meta'), 'pdf-meta');
    const tags = copy(doc.querySelector('.tags'), 'pdf-tags');
    const metadata = node('div', 'pdf-metadata');
    metadata.append(meta, tags);
    heading.append(node('p', 'pdf-kicker', text(doc, '.detail-hero .eyebrow') || text(doc, '.detail-header .eyebrow')), titleRow,
      node('p', 'pdf-project-summary', text(doc, '.detail-summary')), metadata);

    const links = node('div', 'pdf-project-links');
    const web = node('a', '', '프로젝트 상세 ↗');
    web.href = new URL(new URL(href).pathname.replace(/^\/preview\//, '/'), 'https://ugie01.github.io').href;
    links.append(web);
    doc.querySelectorAll('.detail-actions a').forEach(link => links.append(copy(link, '')));
    heading.append(links);

    // Keep the website's facts and section order, but show fewer details in print.
    // The full description remains available through the project link above.
    body.append(heading, copy(doc.querySelector('.detail-keyline')));
    doc.querySelectorAll('.project-detail > .detail-section, .project-detail > .limitations-card').forEach(source => {
      const section = copy(source);
      section.querySelectorAll('.contribution-card ul').forEach(list => {
        [...list.children].slice(2).forEach(item => item.remove());
      });
      section.querySelectorAll('.detail-evidence-gallery figcaption p').forEach(detail => detail.remove());
      if (doc.body.classList.contains('tracking-page')) {
        section.querySelectorAll('.tracking-distance-grid .tracking-panel-copy span').forEach(detail => detail.remove());
      }
      body.append(section);
    });
  }

  function overflows(body) {
    const bounds = body.getBoundingClientRect();
    return body.scrollHeight > body.clientHeight + 1 || body.scrollWidth > body.clientWidth + 1 || [...body.children]
      .some(el => {
        const child = el.getBoundingClientRect();
        return child.bottom > bounds.bottom + 1 || child.right > bounds.right + 1;
      });
  }

  // Preserve exactly one A4 sheet per project. First reduce image frames,
  // then tighten PDF-only spacing, and use the old two-column tracking
  // comparison as a last resort. Never change the live web layout.
  function fitProjectSheet(page) {
    const body = page.querySelector('.pdf-body');
    if (!overflows(body)) return;

    const tracking = page.classList.contains('tracking-page');
    const vip = !!page.querySelector('.vip-evidence-gallery');
    const variable = tracking ? '--pdf-tracking-image-height' : '--pdf-image-height';
    const initial = tracking ? 145 : (vip ? 218 : 182);
    const minimum = tracking ? 94 : (vip ? 140 : 128);

    // Tracking labels sit beside the images. Tighten whitespace
    // before reducing image size to preserve image readability.
    if (tracking) page.classList.add('pdf-density-compact');

    for (let height = initial; height >= minimum && overflows(body); height -= 5) {
      page.style.setProperty(variable, `${height}px`);
    }
    if (overflows(body)) page.classList.add('pdf-density-compact');

    if (tracking && overflows(body)) {
      // Still exactly one page: retain all five images in the old compact
      // left/right card configuration rather than dropping a photo.
      page.classList.add('pdf-tracking-fallback');
      page.style.setProperty(variable, '88px');
    }

    // Keep the old safe minimum size when a long sentence wraps differently.
    if (overflows(body)) {
      const floor = tracking ? 72 : (vip ? 122 : 112);
      for (let height = minimum; height >= floor && overflows(body); height -= 4) {
        page.style.setProperty(variable, `${height}px`);
      }
    }
  }

  async function build() {
    const [home, config] = await Promise.all([
      readPage(new URL('index.html', root)),
      readConfig()
    ]);
    applyTheme(config.theme);
    profileName = text(home, '.hero h1');
    profilePosition = text(home, '.hero-position');
    const cardsById = new Map([...home.querySelectorAll('.featured, .project-card')].map(card => {
      const href = card.querySelector('a[href*="projects/"]').href;
      const id = new URL(href).pathname.split('/').pop().replace(/\.html$/, '');
      return [id, { card, href }];
    }));
    const selected = (config.projects || [])
      .filter(item => item.includeInPdf !== false && cardsById.has(item.id))
      .sort((a, b) => a.order - b.order)
      .map(item => cardsById.get(item.id));
    const projects = await Promise.all(selected.map(async item => ({
      card: item.card,
      doc: await readPage(new URL(item.href)),
      href: item.href
    })));
    profile(home);
    projects.forEach(project);
    await document.fonts.ready;
    await Promise.all([...pages.querySelectorAll('img')].map(img => img.decode()));
    const sheets = [...pages.querySelectorAll('.pdf-sheet')];
    const expectedSheets = projects.length + 1;
    if (sheets.length !== expectedSheets) throw new Error(`예상 페이지는 ${expectedSheets}장인데 ${sheets.length}장이 생성되었습니다.`);
    sheets.filter(page => page.classList.contains('pdf-project')).forEach(fitProjectSheet);
    for (const [index, page] of sheets.entries()) {
      const body = page.querySelector('.pdf-body');
      if (overflows(body)) throw new Error(`${page.querySelector('.pdf-running-head span').textContent}: 프로젝트 내용이 인쇄 영역을 넘습니다.`);
      page.querySelector('.pdf-page-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(sheets.length).padStart(2, '0')}`;
    }
    document.documentElement.dataset.pdfReady = 'true';
    document.querySelector('#save-pdf').disabled = false;
    status.textContent = `세로 A4 / 총 ${sheets.length}페이지 / 웹 포트폴리오 요약본`;
  }
  build().catch(error => {
    pages.replaceChildren();
    status.textContent = `${error.message} 새로고침 후 다시 시도해 주세요.`;
    document.documentElement.dataset.pdfError = error.message;
    console.error(error);
  });
})();
