import React from 'react';

type ErrorLabelProps = {
  text: string;
};

const ErrorLabel = ({ text }: ErrorLabelProps) => {
  return <span className="ml-3 text-sm font-normal text-red-500">{text}</span>;
};

export default ErrorLabel;
