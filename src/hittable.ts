import { Ray } from "./ray";
import { point3, Vec3 } from "./vec3";

export type hit_record = {
  p: point3;
  normal: Vec3;
  t: number;
  frontFace: boolean;
};

export interface Hittable {
  hit(r: Ray, tMin: number, tMax: number): hit_record | null;
}

export function faceNormal(r: Ray, outwardNormal: Vec3): { face: boolean, normal: Vec3 } {
  const frontFace = r.direction().dot(outwardNormal) < 0;
  return { face:frontFace, normal: frontFace ? outwardNormal : outwardNormal.clone().neg() };
}