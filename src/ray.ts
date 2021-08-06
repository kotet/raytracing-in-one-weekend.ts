import { point3, Vec3 } from "./vec3";

export class Ray {
  orig: point3;
  dir: Vec3;
  constructor(origin: point3, direction: Vec3) {
    this.orig = origin;
    this.dir = direction;
  }
  direction(): Vec3 { return this.dir; }
  origin(): point3 { return this.orig; }
  at(t: number): point3 {
    return this.orig.clone().add(this.dir.clone().mul(t));
  }
}