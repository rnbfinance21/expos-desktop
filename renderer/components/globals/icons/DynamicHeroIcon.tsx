import React, { FC } from "react";
import * as HeroIcons from "@heroicons/react/24/solid";
import { classNames } from "../../../utils/string";

type IconName = keyof typeof HeroIcons;

interface DynamicHeroIconProps {
  icon: IconName;
  className?: string;
  onClick?: () => void;
}

const DynamicHeroIcon: FC<DynamicHeroIconProps> = ({
  icon,
  className,
  onClick,
}) => {
  const SingleIcon = HeroIcons[icon];

  return (
    <SingleIcon
      className={classNames("flex-shrink-0 w-4 h-4 text-gray-500", className)}
      onClick={onClick}
    />
  );
};

DynamicHeroIcon.defaultProps = {
  onClick: () => {},
};

export default DynamicHeroIcon;
