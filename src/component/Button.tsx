import type { LucideIcon } from "lucide-react";

type Props = {
  name: string;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon; // ✅ optional
};

const Button = ({
  name,
  onClick,
  className,
  icon: Icon,
}: Props) => {
  return (
    <button
      className={`text-white text-sm px-3 py-2 rounded-md font-medium cursor-pointer bg-[#3525cc] flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {/* OPTIONAL ICON */}
      {Icon && <Icon size={16} />}

      <span>{name}</span>
    </button>
  );
};

export default Button;