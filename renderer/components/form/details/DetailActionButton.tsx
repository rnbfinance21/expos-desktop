import React from "react";
import { classNames } from "../../../utils/string";
import { DynamicHeroIcon } from "../../globals/icons";
import { IconName } from "../../globals/icons/DynamicHeroIcon";

interface DetailActionButtonProps {
  icon: IconName;
  title: string;
  outline?: boolean;
  color?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const DetailActionButton = ({
  icon,
  title,
  outline,
  color,
  iconClassName,
  onClick,
}: DetailActionButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col justify-center items-center"
    >
      <div
        className={classNames(
          "h-12 w-12 rounded-full  flex justify-center items-center",
          outline
            ? `border border-red-500 active:border-red-600`
            : `bg-${color}-500 active:bg-${color}-600`
        )}
      >
        <DynamicHeroIcon
          icon={icon}
          className={classNames(
            "text-red-500 h-[25px] w-[25px]",
            iconClassName
          )}
        />
      </div>
      <span className="text-[10px] mt-1 font-light w-14 h-6 text-center">{title}</span>
    </div>
  );
};

DetailActionButton.defaultProps = {
  outline: true,
  color: "red",
  iconClassName: "",
  onClick: () => {},
};
export default DetailActionButton;
