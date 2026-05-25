import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
};

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className = "", label, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-2 text-black/60 font-medium text-xs block">
          {label}
        </label>

        <input
          ref={ref}
          {...props}
          className={`w-full rounded-lg border bg-[#fcf7ff] text-sm border-gray-300 px-4 focus:border-gray-300 focus:ring-gray-300 py-2 outline-none transition ${className}`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;