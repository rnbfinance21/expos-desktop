import React from "react";
import { classNames, ucwords } from "../../utils/string";

interface ButtonAttributesProp {
  label: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const ButtonAttributes = ({
  label,
  onClick,
  isSelected,
}: ButtonAttributesProp) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "p-2 border border-red-500 rounded text-center active:bg-red-500 active:text-white",
        isSelected ? "bg-red-500 text-white" : ""
      )}
    >
      <p className="text-[10px] font-medium">{ucwords(label)}</p>
    </div>
  );
};

export default ButtonAttributes;
