export function compactNumber(value: number, fraction = 1) {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: fraction,
  }).format(value);
}

export function prefixNumber(value: number, compact = false) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${compact ? compactNumber(value) : value}`;
}
