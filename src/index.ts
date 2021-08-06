import { HittableList } from './hittable_list';
import './index.css';
import { render } from './render';
import { Sphere } from './sphere';
import { Vec3 } from './vec3';

let canvas: HTMLCanvasElement;
let world: HittableList;

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

    world = new HittableList();
    world.push(new Sphere(new Vec3(0, 0, -1), 0.5));
    world.push(new Sphere(new Vec3(0, -100.5, -1), 100));

    render(canvas, world);
    window.addEventListener('resize', onResize);
  });
})();

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(canvas, world);
}