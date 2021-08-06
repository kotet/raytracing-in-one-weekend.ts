import { Ray } from "./ray";
import { color, point3, Vec3 } from "./vec3";

export function render(canvas: HTMLCanvasElement) {
  const width = canvas.width;
  const height = canvas.height;

  const aspectRatio = width / height;

  console.log(width, height, aspectRatio);

  const viewportHeight = 2;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1;

  const origin: point3 = new Vec3(0, 0, 0);
  const horizontal = new Vec3(viewportWidth, 0, 0);
  const vertical = new Vec3(0, viewportHeight, 0);
  const lowerLeftCorner =
    origin.clone()
      .sub(horizontal.clone().mul(1 / 2))
      .sub(vertical.clone().mul(1 / 2))
      .sub(new Vec3(0, 0, focalLength));

  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    console.error('failed to get context');
    return;
  }

  let data = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const ray = new Ray(
        origin,
        lowerLeftCorner.clone()
          .add(horizontal.clone().mul(u))
          .add(vertical.clone().mul(v))
          .sub(origin)
      );
      const pixelColor = ray_color(ray);
      const r = pixelColor.e[0];
      const g = pixelColor.e[1];
      const b = pixelColor.e[2];
      data.data[(y * width + x) * 4 + 0] = 255 * r;
      data.data[(y * width + x) * 4 + 1] = 255 * g;
      data.data[(y * width + x) * 4 + 2] = 255 * b;
      data.data[(y * width + x) * 4 + 3] = 255;
    }
  }

  ctx.putImageData(data, 0, 0);
}

function ray_color(r: Ray): color {
  if (hit_sphere(new Vec3(0, 0, -1), 0.5, r)) {
    return new Vec3(1, 0, 0);
  }
  const unitDirection = r.direction().clone().normalize();
  const t = 0.5 * (unitDirection.y() + 1.0);
  return new Vec3(1, 1, 1).mul(1 - t).add(new Vec3(0.5, 0.7, 1.0).mul(t));
}

function hit_sphere(center: point3, radius: number, r: Ray): boolean {
  const oc = r.origin().clone().sub(center);
  const a = r.direction().dot(r.direction());
  const b = 2 * oc.dot(r.direction());
  const c = oc.dot(oc) - radius * radius;
  const discriminant = b * b - 4 * a * c;
  return discriminant > 0;
}