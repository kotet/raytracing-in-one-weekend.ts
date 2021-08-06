export class Vec3 {
  e: [number, number, number];
  constructor(e0: number, e1: number, e2: number) {
    this.e = [e0, e1, e2];
  }
  x(): number { return this.e[0]; }
  y(): number { return this.e[1]; }
  z(): number { return this.e[2]; }

  neg(): Vec3 { return new Vec3(-this.e[0], -this.e[0], -this.e[0]); }
  add(v: Vec3): Vec3 {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
    return this;
  }
  sub(v: Vec3): Vec3 {
    this.e[0] -= v.e[0];
    this.e[1] -= v.e[1];
    this.e[2] -= v.e[2];
    return this;
  }
  mul(t: number): Vec3 {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
  }
  div(t: number): Vec3 {
    this.e[0] /= t;
    this.e[1] /= t;
    this.e[2] /= t;
    return this;
  }
  normalize(): Vec3 {
    return this.mul(1 / this.length());
  }
  dot(v: Vec3): number {
    return this.e[0] * v.e[0] + this.e[1] * v.e[1] + this.e[2] * v.e[2];
  }
  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.e[1] * v.e[2] - this.e[2] * v.e[1],
      this.e[2] * v.e[0] - this.e[0] * v.e[2],
      this.e[0] * v.e[1] - this.e[1] * v.e[0],
    );
  }
  length_squared(): number {
    return this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2];
  }
  length(): number { return Math.sqrt(this.length_squared()); }
  toString(): string {
    return `(${this.e[0]} ${this.e[1]} ${this.e[2]})`;
  }
  clone(): Vec3 {
    return new Vec3(this.e[0], this.e[1], this.e[2]);
  }
}

export type point3 = Vec3;
export type color = Vec3;