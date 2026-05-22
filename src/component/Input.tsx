import React from "react";

type Props = {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
  label: string
};

const Input = ({
  className = "",
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  disabled = false,
  label
}: Props) => {
  return (
    <div className="w-full">
      <label htmlFor="" className="mb-2 text-black/60 font-medium text-xs">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border bg-[#fcf7ff] text-sm border-gray-300 px-4 focus:border-gray-300 focus:ring-gray-300 py-2 outline-none transition  ${className}`}
      />
    </div>
  );
};

export default Input;
