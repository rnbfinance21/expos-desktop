import React, { HTMLAttributes } from "react";
import FormSection from "./FormSection";
import HeroSection from "./HeroSection";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="w-full min-h-screen flex flex-row bg-white">{children}</div>
  );
};

export default Container;
