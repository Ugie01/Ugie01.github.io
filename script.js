/* Progressive enhancements: content and links also work without JavaScript. */
(() => {
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
    const cards = [...document.querySelectorAll('[data-category]')];
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      cards.forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count += 1;
      });
      document.querySelector('#filter-status').textContent = `${button.textContent} 프로젝트 ${count}개 표시`;
      document.querySelector('.projects-toolbar h3 span').textContent = String(count).padStart(2, '0');
    });
  }
})();
