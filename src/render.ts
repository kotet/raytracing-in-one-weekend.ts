import { Camera } from "./camera";
import { Hittable } from "./hittable";
import { Ray } from "./ray";
import { clamp } from "./util";
import { color, point3, Vec3 } from "./vec3";

export function* render(canvas: HTMLCanvasElement, world: Hittable): Generator<void, void, void> {
  let prevTime = performance.now();
  const width = canvas.width;
  const height = canvas.height;

  const samplePerPixel = 50;

  const aspectRatio = width / height;

  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    console.error('failed to get context');
    return;
  }

  const cam = new Camera(aspectRatio);

  const data = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorAcc = new Vec3(0, 0, 0);
      for (let i = 0; i < samplePerPixel; i++) {
        const u = (x + Math.random()) / width;
        const v = 1 - (y + Math.random()) / height;
        const ray = cam.getRay(u, v);
        const color = ray_color(ray, world);
        colorAcc.add(color);
      }

      const pixelColor = colorAcc.mul(1 / samplePerPixel);
      const r = clamp(pixelColor.e[0], 0, 1);
      const g = clamp(pixelColor.e[1], 0, 1);
      const b = clamp(pixelColor.e[2], 0, 1);
      data.data[(y * width + x) * 4 + 0] = 255 * r;
      data.data[(y * width + x) * 4 + 1] = 255 * g;
      data.data[(y * width + x) * 4 + 2] = 255 * b;
      data.data[(y * width + x) * 4 + 3] = 255;
    }
    const nowTime = performance.now();
    if (15 < nowTime - prevTime) {
      prevTime = nowTime;
      ctx.putImageData(data, 0, 0);
      yield;
    }
  }
}

function ray_color(r: Ray, world: Hittable): color {
  const rec = world.hit(r, 0, 100);
  if (rec !== null) {
    const N = rec.normal;
    return new Vec3(N.x() + 1, N.y() + 1, N.z() + 1).mul(0.5);
  }
  const unitDirection = r.direction().clone().normalize();
  const t = 0.5 * (unitDirection.y() + 1.0);
  return new Vec3(1, 1, 1).mul(1 - t).add(new Vec3(0.5, 0.7, 1.0).mul(t));
}
