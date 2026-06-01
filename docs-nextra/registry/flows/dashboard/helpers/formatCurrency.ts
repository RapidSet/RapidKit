export const formatCurrency = (value: number, unit: string): string => {
  if (unit === '$') {
    return '$' + Math.round(value / 100) / 10 + 'k';
  }
  if (unit === '%') {
    return value + '%';
  }
  return value.toLocaleString();
};
