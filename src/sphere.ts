import { faceNormal, Hittable, hit_record } from "./hittable";
import { Ray } from "./ray";
import { point3 } from "./vec3";

export class Sphere implements Hittable {
  center: point3;
  radius: number;
  constructor(cen: point3, r: number) {
    this.center = cen;
    this.radius = r;
  }
  hit(r: Ray, tMin: number, tMax: number): hit_record | null {
    const oc = r.origin().clone().sub(this.center);
    const a = r.direction().length_squared();
    const halfB = oc.dot(r.direction());
    const c = oc.length_squared() - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) {
      return null;
    }
    const sqrtD = Math.sqrt(discriminant);
    let root = (-halfB - sqrtD) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtD) / a;
      if (root < tMin || tMax < root) {
        return null;
      }
    }
    const pos = r.at(root);
    const front = faceNormal(r,pos.clone().sub(this.center).div(this.radius));
    return {
      t: root,
      p: pos,
      normal: front.normal,
      frontFace: front.face
    };
  }
}