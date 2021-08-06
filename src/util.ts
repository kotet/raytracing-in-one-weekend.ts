export function clamp(x: number, min: number, max: number): number {
  if (x < min) return min;
  if (max < x) return max;
  return x;
}
