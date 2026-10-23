/* Progressive enhancements: content and links also work without JavaScript. */
(() => {
  const isDetailPage = location.pathname.includes('/projects/');
  const siteRoot = new URL(isDetailPage ? '../' : './', location.href);
  let previewConfig = null;
  const projectIdFromElement = element => {
    const link = element?.querySelector('a[href*="projects/"]');
    if (!link) return '';
    return new URL(link.getAttribute('href'), location.href).pathname.split('/').pop().replace(/\.html$/, '');
  };

  function applyTheme(theme = {}) {
    const root = document.documentElement;
    root.dataset.siteTheme = theme.name || 'custom';
    const values = {
      '--site-bg': theme.background,
      '--cream': theme.background,
      '--paper': theme.surface,
      '--ink': theme.text,
      '--muted': theme.muted,
      '--blue': theme.accent,
      '--line': theme.line,
      '--navy': theme.dark,
      '--header-bg': theme.background
    };
    Object.entries(values).forEach(([name, value]) => {
      if (/^#[0-9a-f]{6}$/i.test(value || '')) root.style.setProperty(name, value);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && values['--site-bg']) meta.content = values['--site-bg'];
  }

  function updateProjectFilter(filter) {
    const cards = [...document.querySelectorAll('.project-card[data-category]')];
    let count = 0;
    cards.forEach(card => {
      const configured = card.dataset.configVisible !== 'false';
      const category = filter === 'all' || card.dataset.category === filter;
      card.hidden = !(configured && category);
      if (!card.hidden) count += 1;
    });
    const counter = document.querySelector('.projects-toolbar h3 span');
    if (counter) counter.textContent = String(count).padStart(2, '0');
    return count;
  }

  function applyProjectSettings(config) {
    if (!document.body.classList.contains('home-page')) return;
    const settings = new Map((config.projects || []).map(item => [item.id, item]));
    const featured = document.querySelector('.featured');
    const featuredSetting = settings.get(projectIdFromElement(featured));
    if (featured && featuredSetting) featured.hidden = !featuredSetting.visible;

    const grid = document.querySelector('.project-grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.project-card')];
    cards.forEach(card => {
      const id = projectIdFromElement(card);
      card.dataset.projectId = id;
      card.dataset.configVisible = String(settings.get(id)?.visible !== false);
    });
    cards.sort((a, b) => {
      const aOrder = settings.get(a.dataset.projectId)?.order ?? 999;
      const bOrder = settings.get(b.dataset.projectId)?.order ?? 999;
      return aOrder - bOrder;
    }).forEach(card => grid.append(card));
    updateProjectFilter(document.querySelector('[data-filter][aria-pressed="true"]')?.dataset.filter || 'all');
  }

  // Only the local admin iframe accepts unsaved preview settings.
  if (location.pathname.startsWith('/preview/') && window.parent !== window) {
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'portfolio-admin-preview') return;
      const incoming = event.data.config;
      if (!incoming || !Array.isArray(incoming.projects) || !incoming.theme) return;
      previewConfig = incoming;
      applyTheme(incoming.theme);
      applyProjectSettings(incoming);
    });
  }

  async function loadSiteConfig() {
    try {
      const url = new URL('content/site-config.json', siteRoot);
      url.searchParams.set('v', Date.now().toString());
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`설정 파일 응답 ${response.status}`);
      const config = previewConfig || await response.json();
      applyTheme(config.theme);
      applyProjectSettings(config);
      document.documentElement.dataset.siteConfig = 'ready';
    } catch (error) {
      document.documentElement.dataset.siteConfig = 'fallback';
      console.warn('기본 포트폴리오 설정을 사용합니다.', error);
    }
  }

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav-links');
  function closeMenu() {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  if (menu && nav) {
    document.documentElement.classList.add('js');
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu(); menu.focus();
      }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });
    matchMedia('(min-width: 769px)').addEventListener('change', closeMenu);
  }

  const filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const count = updateProjectFilter(button.dataset.filter);
      const status = document.querySelector('#filter-status');
      if (status) status.textContent = `${button.textContent} 프로젝트 ${count}개 표시`;
    });
  }

  loadSiteConfig();
})();
