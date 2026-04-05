import React from "react";

type InfoItemProps = {
  title: string;
  value: string;
  col?: boolean;
};

const InfoItem = ({ title, value, col }: InfoItemProps) => {
  return (
    <div
      className={`flex ${
        col ? "flex-col" : "flex-row justify-between"
      }  text-xs`}
    >
      <div className="w-28">
        <span className="font-light">{title}</span>
      </div>
      <div className={`flex-1 ${col ? "text-left mt-1" : "text-end"}`}>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
    </div>
  );
};

InfoItem.defaultProps = {
  col: false,
};

export default InfoItem;
