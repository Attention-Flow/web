export function getValueColor(value: number) {
  return value > 0
    ? '#52c41a'
    : value < 0
    ? '#f5222d'
    : 'rgba(255, 255, 255, 0.95)';
}
