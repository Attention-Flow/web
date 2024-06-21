function createRadialGradientTexture(
  { title, value }: { title: string; value: number },
  {
    width,
    height,
    colorStops,
  }: {
    width: number;
    height: number;
    colorStops: { offset: number; color: string }[];
  },
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  const gradient = context!.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
  );

  for (const { offset, color } of colorStops) {
    gradient.addColorStop(offset, color);
  }

  context!.fillStyle = gradient;
  context!.beginPath();
  context!.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
  context!.fill();

  context!.font = "32px Lato, 'PingFang SC', sans-serif, 'Microsoft YaHei'";
  context!.fillStyle = '#ffffff';
  context!.textAlign = 'center';
  const lineHeight = 32;
  const words = title.split(' ');
  let y = (canvas.height - words.length * lineHeight) / 2; // calculate the y-coordinate for vertical centering
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = context!.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > width && i > 0) {
      context!.fillText(line, canvas.width / 2, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context!.fillText(line, canvas.width / 2, y);

  context!.font = "60px Lato, 'PingFang SC', sans-serif, 'Microsoft YaHei'";
  context!.fillStyle =
    value > 0 ? '#52C41A' : value < 0 ? '#F5222D' : '#1677ff';
  context!.textAlign = 'center';
  context!.fillText(
    value === 0 ? '(new)' : `${Math.round(value * 100)}%`,
    canvas.width / 2,
    (9 * canvas.height) / 12,
  );

  return canvas.toDataURL();
}

export const getRedRadialGradientTexture = (title: string, value: number) =>
  createRadialGradientTexture(
    { title, value },
    {
      width: 256,
      height: 256,
      colorStops: [
        {
          offset: 0,
          color: '#1a0b0d',
        },
        {
          offset: 0.85,
          color: '#431418',
        },
        {
          offset: 1,
          color: '#d32029',
        },
      ],
    },
  );

export const getGreenRadialGradientTexture = (title: string, value: number) =>
  createRadialGradientTexture(
    { title, value },
    {
      width: 256,
      height: 256,
      colorStops: [
        {
          offset: 0,
          color: '#0a1008',
        },
        {
          offset: 0.85,
          color: '#1d3712',
        },
        {
          offset: 1,
          color: '#3c8618',
        },
      ],
    },
    // #1f341f, #234422, #275424, #2c6426, #317526, #388724, #409820, #49aa19
  );

export const getWhiteRadialGradientTexture = (title: string, value: number) =>
  createRadialGradientTexture(
    { title, value },
    {
      width: 256,
      height: 256,
      colorStops: [
        {
          offset: 0,
          color: '#0b111c',
        },
        {
          offset: 0.85,
          color: '#112545',
        },
        {
          offset: 1,
          color: '#1554ad',
        },
      ],
    },
  );
