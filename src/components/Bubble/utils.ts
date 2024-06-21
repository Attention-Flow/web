import * as d3 from 'd3';
import { Body } from 'matter-js';

export function bubblePacking<T>(
  width: number,
  height: number,
  data: T[],
  valueKey: string = 'value',
): (T & { r: number; x: number; y: number })[] {
  // create pack layout
  const pack = d3.pack().size([width, height]).padding(2);

  // assign positions and sizes to circles
  const circles = pack<{ value: number }>(
    d3
      .hierarchy<any>({
        children: data.map((d) => ({ ...d, value: Math.abs(d[valueKey]) })),
      })
      .sum((d) => d.value),
  ).leaves() as any;

  return data.map((d, index) => ({
    ...d,
    x: circles[index].x,
    y: circles[index].y,
    r: circles[index].r,
  }));
}

export function calcBubbleResizeScale(
  bubbles: Body[] | { circleRadius: number }[],
  canvasSize: { width: number; height: number },
) {
  const { width, height } = canvasSize;
  const canvasArea = width * height;
  let bubbleArea = 0;
  for (const bubble of bubbles) {
    const a = bubble.circleRadius * 2;
    bubbleArea += a * a;
  }
  return Math.sqrt((canvasArea * 0.98) / bubbleArea);
}
