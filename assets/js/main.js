const toggle = document.querySelector('[data-theme-toggle]');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  toggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  toggle?.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

setTheme(savedTheme || preferredTheme);
toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

document.querySelectorAll('[data-nav] a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

const newsList = document.querySelector('[data-news-list]');
const newsToggle = document.querySelector('[data-news-toggle]');
const newsItems = newsList ? Array.from(newsList.querySelectorAll('.news-item')) : [];
const visibleNewsCount = 4;

function setNewsExpanded(expanded) {
  newsItems.forEach((item, index) => {
    item.hidden = !expanded && index >= visibleNewsCount;
  });

  if (newsToggle) {
    const remaining = Math.max(newsItems.length - visibleNewsCount, 0);
    newsToggle.hidden = remaining === 0;
    newsToggle.setAttribute('aria-expanded', String(expanded));
    newsToggle.textContent = expanded ? 'Show less' : `Show ${remaining} more`;
  }
}

if (newsItems.length > visibleNewsCount) {
  setNewsExpanded(false);
  newsToggle?.addEventListener('click', () => {
    setNewsExpanded(newsToggle.getAttribute('aria-expanded') !== 'true');
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const visitorCount = document.querySelector('[data-visitor-count]');
if (visitorCount) {
  fetch('https://shuguosun.goatcounter.com/counter/TOTAL.json')
    .then((response) => {
      if (!response.ok) throw new Error('Visitor count unavailable');
      return response.json();
    })
    .then((data) => {
      if (data.count) visitorCount.textContent = data.count;
    })
    .catch(() => {
      visitorCount.closest('.visitor-counter')?.setAttribute('title', 'Visitor count is temporarily unavailable');
    });
}
