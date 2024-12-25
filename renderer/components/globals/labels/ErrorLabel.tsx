import React from "react";
import { twMerge } from "tailwind-merge";

type ErrorLabelProps = {
    text: string;
    className?: string;
};

const ErrorLabel = ({ text, className }: ErrorLabelProps) => {
    return (
        <span
            className={twMerge(
                "ml-3 text-sm font-normal text-red-500",
                className
            )}
        >
            {text}
        </span>
    );
};

export default ErrorLabel;
