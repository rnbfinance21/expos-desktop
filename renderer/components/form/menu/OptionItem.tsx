import { ChangeEvent, FC } from "react";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

interface OptionItemProps {
  data: {
    name: string;
    price: number;
    type: number;
    label: string;
    value: number;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const OptionItem: FC<OptionItemProps> = ({
  data: { name, label, price, type, value },
  onChange,
  checked,
}) => {
  return (
    <div className="flex flex-row justify-between items-center py-4 border-b">
      <label htmlFor={`${label}_${value}`} className="text-xs font-normal">
        {ucwords(label)}
      </label>
      <div className="flex items-center">
        <span className="text-xs font-normal mr-2">
          {price === 0 ? "Gratis" : `+${numberFormat(price, 0)}`}
        </span>
        <input
          id={`${name}_${value}`}
          name={name}
          type={type === 1 ? "radio" : "checkbox"}
          value={value}
          className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
          onChange={onChange}
          checked={checked}
        />
      </div>
    </div>
  );
};

export default OptionItem;
