import type { LucideIcon } from "lucide-react";

type Props = {
  name: string;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  variant?: "primary" | "danger" | "edit";
};

const Button = ({
  name,
  onClick,
  className,
  icon: Icon,
  variant = "primary",
}: Props) => {
  const base =
    "text-sm px-3 py-2 rounded-md font-medium cursor-pointer flex items-center justify-center gap-2";

  const styles = {
    primary: "bg-[#3525cc] text-white",
    edit: "bg-transparent text-black",
    danger: "border border-red-700 text-red-700",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon size={16} />}
      <span>{name}</span>
    </button>
  );
};

export default Button;
