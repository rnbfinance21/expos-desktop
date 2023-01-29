/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, HTMLProps } from "react";
import { classNames } from "../../../utils/string";

interface TextInputProps extends HTMLProps<HTMLInputElement> {
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={classNames(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

TextInput.defaultProps = {
  className: "",
};

export default TextInput;
