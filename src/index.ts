import './index.css';

(() => {
  window.addEventListener('load', () => {
    const body = document.body;
    const canvas = document.createElement('canvas');
    body.appendChild(canvas);
    const nav = document.createElement('nav');
    const textarea = document.createElement('textarea');
    nav.appendChild(textarea);
    body.appendChild(nav);
  });
})();
