import './index.css';
import { render } from './render';

let canvas: HTMLCanvasElement;

(() => {
  window.addEventListener('load', () => {
    const body = document.body;
    canvas = document.createElement('canvas');
    body.appendChild(canvas);
    const nav = document.createElement('nav');
    const textarea = document.createElement('textarea');
    nav.appendChild(textarea);
    body.appendChild(nav);
    renderingLoop();
  });
})();

function renderingLoop() {
  render(canvas);
  requestAnimationFrame(renderingLoop);
}