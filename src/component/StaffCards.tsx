import { Calendar } from "lucide-react";

type StaffCardsProps = {
  name: string;
  role?: string;
  image?: string;
  description?: string;
  onClick?: () => void;
};

const StaffCards = ({
  name,
  role = "Master Stylist",
  image,
  description,
  onClick,
}: StaffCardsProps) => {
  return (
    <div
      onClick={onClick}
      className="
        border border-gray-200 bg-white rounded-2xl p-5
        w-full max-w-xs shadow-sm flex flex-col items-center text-center
        min-h-[320px]
      "
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-black/40">
            {name?.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <h2 className="mt-4 text-lg font-semibold">{name}</h2>

      {/* Badge */}
      <span className="mt-2 px-3 py-1 text-xs font-medium text-[#3525cc] bg-[#edeaff] rounded-full">
        {role}
      </span>

      {/* Description (fixed height area) */}
      <div className="mt-3 min-h-[60px] flex items-start justify-center">
        <p className="text-xs text-black/60 line-clamp-3">
          {description ? (
            description
          ) : (
            <span className="text-black/50">No description</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default StaffCards;
