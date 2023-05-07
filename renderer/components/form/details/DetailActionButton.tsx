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
          "p-3 rounded-full  flex justify-center items-center",
          outline
            ? `border border-red-500 active:border-red-600`
            : `bg-${color}-500 active:bg-${color}-600`
        )}
      >
        <DynamicHeroIcon
          icon={icon}
          className={classNames(
            "text-red-500 h-[20px] w-[20px]",
            iconClassName
          )}
        />
      </div>
      <div className="w-14 h-6  mt-1 flex flex-col justify-start items-center flex-wrap">
        <span className="text-[10px] font-light text-center">{title}</span>
      </div>
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
