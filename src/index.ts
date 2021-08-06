import './index.css';
import { render } from './render';

let canvas: HTMLCanvasElement;

(() => {
  window.addEventListener('load', () => {
    const body = document.body;
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    body.appendChild(canvas);
    const nav = document.createElement('nav');
    const textarea = document.createElement('textarea');
    nav.appendChild(textarea);
    body.appendChild(nav);
    render(canvas);
    window.addEventListener('resize', onResize);
  });
})();

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(canvas);
}