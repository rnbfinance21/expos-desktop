import Image from "next/image";
import React from "react";
import IconRamen from "../../../resources/images/icon-ramen-2.png";

const HeroSection = () => {
  return (
    <div className="flex-1 bg-red-500 flex justify-center items-center">
      <div className="w-40 h-40 bg-white rounded-lg shadow overflow-hidden">
        <Image src={IconRamen} alt="Icon Ramen" width={160} height={160} />
      </div>
    </div>
  );
};

export default HeroSection;
