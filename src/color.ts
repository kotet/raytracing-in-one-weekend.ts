import { color } from "./vec3";

export function color2Str(v: color) {
  return `(${v.e[0] * 255} ${v.e[1] * 255} ${v.e[2] * 255})`;
}