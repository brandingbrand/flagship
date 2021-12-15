function shade(color: string, percent: number): string {
  if (color.length > 7) {
    return shadeRGBColor(color, percent);
  }

  return shadeHexColor(color, percent);
}

function shadeRGBColor(color: string, percent: number): string {
  const components = color.split(',');
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = parseInt(components[0].slice(4), 10);
  const G = parseInt(components[1], 10);
  const B = parseInt(components[2], 10);

  return (
    'rgb(' +
    (Math.round((t - R) * p) + R) +
    ',' +
    (Math.round((t - G) * p) + G) +
    ',' +
    (Math.round((t - B) * p) + B) +
    ')'
  );
}

function shadeHexColor(color: string, percent: number): string {
  const hex = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = hex >> 16;
  const G = (hex >> 8) & 0x00ff;
  const B = hex & 0x0000ff;

  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * Darken a color by a percentage
 *
 * @param {string} color color hex, eg. #555555
 * @param {number} perc percentage to shade, eg: 60
 * @returns {string} the darkened color
 */
export function darken(color: string, perc: number): string {
  if (color === 'transparent') {
    return 'transparent';
  }

  return shade(color, -(perc / 100));
}

/**
 * Ligten a color by a percentage
 *
 * @param {string} color color hex, eg. #555555
 * @param {number} perc percentage to shade, eg: 60
 * @returns {string} the lightened color
 */
export function lighten(color: string, perc: number): string {
  if (color === 'transparent') {
    return 'transparent';
  }

  return shade(color, perc / 100);
}
