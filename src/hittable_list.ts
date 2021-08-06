import { Hittable, hit_record } from "./hittable";
import { Ray } from "./ray";

export class HittableList implements Hittable {
  objects: Hittable[];
  constructor() {
    this.objects = [];
  }
  push(object: Hittable) {
    this.objects.push(object);
  }
  hit(r: Ray, tMin: number, tMax: number): hit_record | null {
    let closestSoFar = tMax;
    let rec: hit_record | null = null;
    for (const object of this.objects) {
      const tempRec = object.hit(r, tMin, closestSoFar);
      if (tempRec !== null) {
        closestSoFar = tempRec.t;
        rec = tempRec;
      }
    }
    return rec;
  }
}