import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router";
import { useRef } from "react";
import StaffCards from "../../component/StaffCards";

type ContextType = {
  business: any;
  staffs: any;
};

const StaffPage = () => {
  const { business, staffs } = useOutletContext<ContextType>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div>
      {/* HERO */}
      <div className="h-72 sm:h-96 w-full overflow-hidden relative">
        <img
          src={business?.coverImage}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black">
            {business?.name}
          </h1>

          <p className="text-xs sm:text-sm text-black flex items-center gap-1 mt-2 sm:mt-4 font-thin">
            <MapPin className="w-4" />
            {business?.address}
          </p>
        </div>
      </div>

      {/* STAFF SECTION */}
      <div className="max-w-7xl mx-auto mt-10 pb-10 px-4">
        <h1 className="text-4xl font-semibold mb-6">Our Specialists</h1>

        {/* ARROWS (only show if more than 4) */}
        {staffs?.length > 4 && (
          <div className="flex justify-end gap-2 mb-3 ">
            <button
              onClick={scrollLeft}
              className="p-2 border rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="p-2 border rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
        >
          {staffs?.map((item: any) => (
            <div
              key={item.id}
              className="
                shrink-0
                w-full sm:w-1/2 lg:w-1/4
              "
            >
              <StaffCards
                name={item.name}
                role={item.role}
                image={item.avatar} // FIXED: was image → avatar
                description={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
