import React, { HTMLAttributes } from "react";

interface LoginContainerProps extends HTMLAttributes<HTMLDivElement> {}

const LoginContainer = ({ children }: LoginContainerProps) => {
  return (
    <div className="w-full min-h-screen flex flex-row bg-white">{children}</div>
  );
};

export default LoginContainer;
