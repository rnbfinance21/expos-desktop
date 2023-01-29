export const numberFormat = (number: number, fixed = 2) => {
  const value = Math.abs(number);

  const currency = value
    .toFixed(fixed)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return currency;
};

export const roundedCurrency = (val: number) => Math.floor(val / 50000) * 50000;
