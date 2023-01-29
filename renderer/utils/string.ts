/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
export const classNames = (...classes: unknown[]) => {
  return classes.filter(Boolean).join(' ');
};

export const ucwords = (str: string) => {
  str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  return str;
};
