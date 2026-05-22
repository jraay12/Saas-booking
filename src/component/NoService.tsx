import { Calendar } from "lucide-react";

const NoService = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* LOGO / ICON */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#edeaff]">
        <Calendar className="w-8 h-8 text-[#3525cc]" />
      </div>

      {/* TITLE */}
      <h1 className="mt-4 text-xl font-semibold text-black">
        No service available yet
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-2 text-sm text-black/60 max-w-md">
        The business is currently setting up their booking schedule. Please check back later to view available appointments and services.
      </p>
    </div>
  );
};

export default NoService;