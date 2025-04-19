/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { twMerge } from "tailwind-merge";

export const classNames = (...classes: unknown[]) => {
  // classes.filter(Boolean).join(' ');
  return twMerge([...(classes as string[])]);
};

export const ucwords = (str: string) => {
  str = str?.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  return str;
};

export const generateRandomString = (length = 32) => {
  const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
      result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
      );
  }

  return result;
};
