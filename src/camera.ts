import { Ray } from "./ray";
import { point3, Vec3 } from "./vec3";

export class Camera {
  origin: point3;
  lowerLeftCorner: point3;
  horizontal: Vec3;
  vertical: Vec3;
  constructor(aspectRatio: number) {
    const viewportHeight = 2.0;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1;

    this.origin = new Vec3(0, 0, 0);
    this.horizontal = new Vec3(viewportWidth, 0, 0);
    this.vertical = new Vec3(0, viewportHeight, 0);
    this.lowerLeftCorner =
      this.origin.clone()
        .sub(this.horizontal.clone().mul(0.5))
        .sub(this.vertical.clone().mul(0.5))
        .sub(new Vec3(0, 0, focalLength));
  }
  getRay(u: number, v: number): Ray {
    return new Ray(
      this.origin,
      this.lowerLeftCorner.clone()
        .add(this.horizontal.clone().mul(u))
        .add(this.vertical.clone().mul(v))
        .sub(this.origin)
    );
  }
}