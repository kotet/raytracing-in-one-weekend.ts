export function render(canvas: HTMLCanvasElement) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    console.error('failed to get context');
    return;
  }

  let data = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = x / width;
      const g = 1 - y / height;
      const b = 0.25;
      data.data[(y * width + x) * 4 + 0] = 255 * r;
      data.data[(y * width + x) * 4 + 1] = 255 * g;
      data.data[(y * width + x) * 4 + 2] = 255 * b;
      data.data[(y * width + x) * 4 + 3] = 255;
    }
  }

  ctx.putImageData(data, 0, 0);
}