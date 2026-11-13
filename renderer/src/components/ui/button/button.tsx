/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import { classNames } from "@/src/utils/string";
import React, { HTMLProps } from "react";

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  blok?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button = ({
  blok = false,
  type = "button",
  isLoading = false,
  className = "",
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "p-2 border border-red-300 hover:border-red-500 shadow rounded-md text-red-500 font-normal text-sm",
        blok ? "block w-full " : "",
        className
      )}
      {...props}
    >
      {isLoading ? "Mohon Tunggu..." : children}
    </button>
  );
};

export default Button;
