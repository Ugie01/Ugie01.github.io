/* PDF pages reuse the website's complete project sections and image layouts. */
(() => {
  const pages = document.querySelector('#print-pages');
  const status = document.querySelector('#print-status');
  const save = document.querySelector('#save-pdf');
  if (location.protocol === 'file:') {
    location.replace('http://127.0.0.1:4173/print.html');
    return;
  }
  const root = new URL('./', location.href);
  const revision = Date.now().toString();
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
    footer.append(node('span', '', '이명욱 / Robot Software Engineer'), node('span', 'pdf-page-number'));
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
    const github = node('a', 'pdf-profile-link', 'GitHub / Ugie01 ↗');
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
    web.href = new URL(new URL(href).pathname, 'https://ugie01.github.io').href;
    links.append(web);
    doc.querySelectorAll('.detail-actions a').forEach(link => links.append(copy(link, '')));
    heading.append(links);

    // Clone whole sections, including every bullet, caption and problem-solving step.
    // The main-page cover is intentionally not part of a project detail sheet.
    body.append(heading, copy(doc.querySelector('.detail-keyline')));
    doc.querySelectorAll('.project-detail > .detail-section, .project-detail > .limitations-card')
      .forEach(section => body.append(copy(section)));
  }

  function overflows(body) {
    const bounds = body.getBoundingClientRect();
    return [...body.children]
      .some(el => el.getBoundingClientRect().bottom > bounds.bottom + 1);
  }

  async function build() {
    const home = await readPage(new URL('index.html', root));
    const cards = [...home.querySelectorAll('.featured, .project-card')];
    const projects = await Promise.all(cards.map(async card => {
      const href = card.querySelector('a[href*="projects/"]').href;
      return {card, doc: await readPage(new URL(href)), href};
    }));
    profile(home);
    projects.forEach(project);
    await document.fonts.ready;
    await Promise.all([...pages.querySelectorAll('img')].map(img => img.decode()));
    // Preserve every section if future website copy grows: continue on another sheet.
    for (const page of [...pages.querySelectorAll('.pdf-project')]) {
      let current = page;
      while (overflows(current.querySelector('.pdf-body'))) {
        const body = current.querySelector('.pdf-body');
        const sections = [...body.children].filter(el => el.matches('.detail-section, .limitations-card'));
        if (sections.length < 2) throw new Error(`${text(page, '.pdf-running-head span')}: 인쇄 영역을 확인해 주세요.`);
        const nextBody = sheet(text(page, '.pdf-running-head span'), page.className.replace('pdf-sheet ', ''));
        nextBody.dataset.source = body.dataset.source;
        nextBody.append(node('h1', 'pdf-continuation-title', text(page, '.pdf-title-row h1') || text(page, '.pdf-running-head span')));
        const moved = [];
        while (overflows(body) && sections.length > 1) {
          const section = sections.pop();
          section.remove();
          moved.unshift(section);
        }
        nextBody.append(...moved);
        current.after(nextBody.closest('.pdf-sheet'));
        current = nextBody.closest('.pdf-sheet');
      }
    }
    const sheets = [...pages.querySelectorAll('.pdf-sheet')];
    for (const [index, page] of sheets.entries()) {
      const body = page.querySelector('.pdf-body');
      if (overflows(body)) throw new Error(`${page.querySelector('.pdf-running-head span').textContent}: 프로젝트 내용이 인쇄 영역을 넘습니다.`);
      page.querySelector('.pdf-page-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(sheets.length).padStart(2, '0')}`;
    }
    document.documentElement.dataset.pdfReady = 'true';
    status.textContent = `세로 A4 / 총 ${sheets.length}페이지 / 웹 포트폴리오 내용 전체 반영`;
    save.disabled = false;
    save.addEventListener('click', () => window.print());
  }
  build().catch(error => {
    pages.replaceChildren();
    status.textContent = `${error.message} 새로고침 후 다시 시도해 주세요.`;
    document.documentElement.dataset.pdfError = error.message;
    console.error(error);
  });
})();
