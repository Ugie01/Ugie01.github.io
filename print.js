/* PDF summaries read live website content; no separate project copy is maintained. */
(() => {
  const pages = document.querySelector('#print-pages');
  const status = document.querySelector('#print-status');
  const save = document.querySelector('#save-pdf');
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
    intro.append(node('p', 'pdf-kicker', text(home, '.hero .eyebrow')),
      node('h1', '', text(home, '.hero h1')),
      node('p', 'pdf-name-en', text(home, '.hero-name-en')),
      node('p', 'pdf-position', text(home, '.hero-position')),
      node('p', 'pdf-description', text(home, '.hero-description')));
    const facts = copy(home.querySelector('.profile-facts'), 'pdf-facts');
    intro.append(facts);
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
    body.append(hero, skills);
  }

  function project({card, doc, href}) {
    const title = text(doc, 'h1');
    const body = sheet(title, 'pdf-project');
    const heading = node('header', 'pdf-project-heading');
    const titleRow = node('div', 'pdf-title-row');
    titleRow.append(node('h1', '', title), node('span', 'pdf-status', text(doc, '.status')));
    const meta = copy(doc.querySelector('.detail-meta'), 'pdf-meta');
    const tags = copy(doc.querySelector('.tags'), 'pdf-tags');
    const metadata = node('div', 'pdf-metadata');
    metadata.append(meta, tags);
    heading.append(node('p', 'pdf-kicker', text(doc, '.detail-header .eyebrow')), titleRow,
      node('p', 'pdf-project-summary', text(doc, '.detail-summary')), metadata);

    const layout = node('div', 'pdf-project-layout');
    const visual = node('section', 'pdf-visual-column');
    const figure = node('figure', 'pdf-project-image');
    const image = copy(card.querySelector('img'));
    figure.append(image, node('figcaption', '', image.alt));
    const flow = node('section', 'pdf-flow-section');
    const sourceFlow = doc.querySelector('.system-flow');
    if (sourceFlow) {
      flow.append(node('h2', '', text(sourceFlow.parentElement, 'h2')), copy(sourceFlow, 'pdf-flow'));
    }
    const links = node('div', 'pdf-project-links');
    const web = node('a', '', '프로젝트 상세 ↗');
    web.href = new URL(new URL(href).pathname, 'https://ugie01.github.io').href;
    links.append(web);
    doc.querySelectorAll('.detail-actions a').forEach(link => links.append(copy(link, '')));
    visual.append(figure, flow, links);

    const content = node('div', 'pdf-content-column');
    const role = node('section', 'pdf-role');
    role.append(node('p', 'pdf-kicker', 'MY ROLE'), node('strong', '', text(doc, '.role-callout strong')));
    const work = node('section', 'pdf-work');
    work.append(node('h2', '', text(doc, '.detail-main .subheading')));
    const list = node('ul', 'pdf-implementation');
    // Select complete existing bullets, never invent or truncate a sentence.
    [...doc.querySelectorAll('.implementation-list li')].slice(0, 4).forEach(li => list.append(copy(li)));
    work.append(list);
    const result = node('section', 'pdf-result');
    result.append(node('h2', '', '확인 결과와 한계'),
      node('strong', '', text(doc, '.detail-result strong')));
    const limitation = doc.querySelector('.case-grid .limitation');
    if (limitation) result.append(copy(limitation, 'pdf-limitation'));
    content.append(role, work, result);
    layout.append(visual, content);
    body.append(heading, layout);
  }

  function overflows(body) {
    const bounds = body.getBoundingClientRect();
    return [...body.querySelectorAll('.pdf-project-layout, .pdf-skills, .pdf-result, .pdf-project-links')]
      .some(el => el.getBoundingClientRect().bottom > bounds.bottom + 1);
  }

  async function build() {
    if (location.protocol === 'file:') throw new Error('웹 포트폴리오에서 PDF로 저장을 눌러 주세요.');
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
    const sheets = [...pages.querySelectorAll('.pdf-sheet')];
    for (const [index, page] of sheets.entries()) {
      const body = page.querySelector('.pdf-body');
      const list = page.querySelector('.pdf-implementation');
      // Future longer copy still gets one project per sheet: omit whole trailing bullets only.
      while (overflows(body) && list?.children.length > 2) list.lastElementChild.remove();
      if (overflows(body)) throw new Error(`${page.querySelector('.pdf-running-head span').textContent}: 요약 분량이 한 페이지를 넘습니다.`);
      page.querySelector('.pdf-page-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(sheets.length).padStart(2, '0')}`;
    }
    document.documentElement.dataset.pdfReady = 'true';
    status.textContent = `가로 A4 / 총 ${sheets.length}페이지 / 프로젝트별 1페이지`;
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
