import {
  Book,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from "lucide-react";

type Variant = "total" | "pending" | "confirmed" | "completed" | "canceled";

type Props = {
  variant: Variant;
  label?: string;
  value: number | string;
};

const VARIANT_CONFIG = {
  total: {
    label: "Total",
    icon: Book,
    className: "text-black bg-gray-100 border-gray-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-yellow-600 ",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "text-blue-600 ",
  },
  completed: {
    label: "Completed",
    icon: ClipboardList,
    className: "text-green-600 ",
  },
  canceled: {
    label: "Canceled",
    icon: XCircle,
    className: "text-red-600 ",
  },
};

const Cards = ({ variant, value, label }: Props) => {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div
      className={`md:max-w-70 min-h-30 p-4 shadow-sm border border-gray-200 bg-white border-l-2 rounded-lg ${config.className}`}
    >
      <div className="flex justify-between items-center">
        <h1 className="uppercase text-xs font-medium opacity-80 text-black">
          {label ?? config.label}
        </h1>
        <Icon size={20} />
      </div>

      <h1 className="text-4xl font-bold mt-4">{value}</h1>
    </div>
  );
};

export default Cards;