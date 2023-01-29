import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ children }: CardProps) => {
  return <div className="px-4 py-6 rounded-md bg-white w-96">{children}</div>;
};

export default Card;
