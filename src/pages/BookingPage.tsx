import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useOutletContext } from "react-router";
import Button from "../component/Button";
import { useState } from "react";
import Search from "../component/Search";
import ServiceCard from "../component/ServiceCard";

type ContextType = {
  business: any;
  services: any;
  staffs: any;
};

export default function BookingPage() {
  const { business, services, staffs } = useOutletContext<ContextType>();

  const categories = Array.from(
    new Set(services.map((item: any) => item.category)),
  );

  const [categoryActive, setCategoryActive] = useState(categories[0]);
  const [filterService, setFilterService] = useState<string>("");
  const [serviceSelected, setServiceSelected] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredService = services.filter(
    (item: any) => item.category === categoryActive,
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* HERO */}
      <div className="mt-6 h-72 sm:h-96 w-full overflow-hidden shadow-md relative rounded-2xl">
        <img
          src={business?.coverImage}
          className="w-full h-full object-cover"
        />

        {/* gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />

        {/* text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black">
            {business?.name}
          </h1>

          <p className="text-sm sm:text-md text-black/70 max-w-2xl mt-2 sm:mt-4 font-medium">
            {business?.description}
          </p>

          <p className="text-xs sm:text-sm text-black max-w-2xl mt-2 sm:mt-4 font-thin flex items-center gap-1">
            <MapPin className="w-4" />
            {business.address}
          </p>

          <div className="mt-4 sm:mt-6 w-full sm:w-auto">
            <Button name="Book Appointment" className="w-full sm:w-50" />
          </div>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-10 sm:mt-20">
        {/* Left */}
        <div className="h-60 sm:h-90 rounded-lg p-4">
          <div className="flex gap-4">
            {categories.map((item: any) => (
              <p
                key={item}
                className={`cursor-pointer ${
                  item === categoryActive
                    ? "border-b-2 border-[#3525cc] text-[#3525cc]"
                    : ""
                }`}
                onClick={() => setCategoryActive(item)}
              >
                {item}
              </p>
            ))}
          </div>

          <div className="mt-4">
            <Search
              placeHolder="Search services..."
              value={filterService ?? ""}
              onChange={setFilterService}
            />
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {filteredService &&
              filteredService.map((item: any) => (
                <ServiceCard
                  key={item.id}
                  service={item}
                  serviceSelected={serviceSelected}
                  onSelect={() => setServiceSelected(item.id)}
                />
              ))}
          </div>
        </div>

        {/* Right */}
        <div className="h-60 sm:h-112 border border-gray-300 shadow-xl rounded-lg p-6">
          <AppointmentCard
            staffs={staffs}
            selectedStaff={selectedStaff}
            onStaffSelect={setSelectedStaff}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
   APPOINTMENT CARD
========================= */

type AppointmentCardProps = {
  staffs: any[];
  selectedStaff: string;
  onStaffSelect: (value: string) => void;

  onSelectDate: (value: string) => void;
  selectedDate: string;
};

function AppointmentCard({
  staffs,
  selectedStaff,
  onStaffSelect,

  onSelectDate,
  selectedDate,
}: AppointmentCardProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-medium text-black">Schedule Appointment</h1>

      <StaffSection
        staffs={staffs}
        selectedStaff={selectedStaff}
        onSelect={onStaffSelect}
      />
      <DateSection onSelectDate={onSelectDate} selectedDate={selectedDate} />
    </div>
  );
}

/* =========================
   STAFF SECTION
========================= */

type StaffProps = {
  staffs: any[];
  onSelect: (value: string) => void;
  selectedStaff: string;
};

function StaffSection({ staffs, onSelect, selectedStaff }: StaffProps) {
  return (
    <div className="mt-6 flex flex-col">
      <h1>Select Staff</h1>

      <div className="flex gap-2 mt-2">
        {staffs?.map((staff) => {
          const isSelected = selectedStaff === staff.id;

          return (
            <div key={staff.id} onClick={() => onSelect(staff.id)}>
              <img
                src={staff.avatar}
                className={`w-10 h-10 rounded-full cursor-pointer opacity-60 ${
                  isSelected ? "opacity-100 ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

type DateSectionProps = {
  onSelectDate: (value: string) => void;
  selectedDate: string;
};
function DateSection({ onSelectDate, selectedDate }: DateSectionProps) {
  const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date); // avoid mutation
    const day = newDate.getDay(); // 0 (Sun) - 6 (Sat)

    const diff = newDate.getDate() - day + 1; // Monday start
    newDate.setDate(diff);

    return newDate;
  };

  const getWeekDays = (startDate: Date) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getStartOfWeek(new Date()),
  );

  const weekDays = getWeekDays(currentWeekStart);

  const goNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goPrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-gray-700">
          {currentWeekStart.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div>
          <button
            onClick={goPrevWeek}
            className="text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goNextWeek}
            className="text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const targetDay = new Date(day);
          targetDay.setHours(0, 0, 0, 0);

          const isPastDay = today > targetDay;

          const isSelectedDate =
            selectedDate &&
            new Date(selectedDate).toDateString() === day.toDateString();

          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                if (isPastDay) return;
                onSelectDate(day.toISOString());
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition  ${isSelectedDate ? "bg-[#3525cc] text-white" : ""}
        ${isPastDay ? "opacity-40 cursor-not-allowed" : "cursor-pointer "}
      `}
            >
              <span
                className={`text-xs text-gray-500 ${isSelectedDate ? "text-white" : ""}`}
              >
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>

              <span className="text-md font-medium">{day.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function AvailableTime(){

}