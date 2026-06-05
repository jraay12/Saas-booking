import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useOutletContext } from "react-router";
import Button from "../../component/Button";
import { useEffect, useState } from "react";
import Search from "../../component/Search";
import ServiceCard from "../../component/ServiceCard";
import { useNavigate, useParams } from "react-router";
import NoService from "../../component/NoService";
import {
  useGetAllAssignedStaffPublic,
  useGetAllServicesPublic,
} from "../../features/service/service.hook";
import type {
  AssignedStaff,
  GetBusinessHoursResponse,
} from "../../types/types";
import { getInitials } from "../../utils/getInitial";
import { useGetAvailableSlot } from "../../features/booking/booking.hook";
import { useGetBusinessHoursPublic } from "../../features/business/business.hook";
import { convertTo12Hours } from "../../utils/convertTimeTo12";
/* =========================
   TYPES
========================= */

type ContextType = {
  business: any;
  services: any;
  staffs: any;
  timeSlots: any;
};

/* =========================
   MAIN PAGE
========================= */

export default function BookingPage() {
  const { business } = useOutletContext<ContextType>();
  const [serviceSelected, setServiceSelected] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: services } = useGetAllServicesPublic();
  const { data: staffs = [] } = useGetAllAssignedStaffPublic(serviceSelected);
  const { data: timeSlots } = useGetAvailableSlot(
    business?.id ?? "",
    serviceSelected,
    selectedStaff,
    selectedDate,
  );
  const { data: businessHours } = useGetBusinessHoursPublic(business?.id);

  const navigate = useNavigate();
  const { slug } = useParams();

  const categories = [
    "All",
    ...Array.from(new Set(services?.map((item: any) => item.category))),
  ];

  const ITEMS_PER_PAGE = 3;

  const [categoryActive, setCategoryActive] = useState("All");
  const [filterService, setFilterService] = useState<string>("");

  const [selectedTime, setSelectedTime] = useState("");

  const filteredService =
    services?.filter((item: any) => {
      const matchesCategory =
        categoryActive === "All" || item.category === categoryActive;

      const matchesSearch = item.service_name
        .toLowerCase()
        .includes(filterService.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  const totalPages = Math.ceil(filteredService.length / ITEMS_PER_PAGE);

  const paginatedServices = filteredService.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryActive, filterService]);

  const serviceDetails = services?.find(
    (item: any) => item.id === serviceSelected,
  );

  const isServiceSelected = !!serviceSelected;
  const isStaffSelected = !!selectedStaff;
  const isDateSelected = !!selectedDate;

  const handleSubmit = () => {
    const payload = {
      service: serviceSelected,
      staff: selectedStaff,
      date: selectedDate,
      time: selectedTime,
      totalPrice: serviceDetails?.price,
      business_id: business?.id
    };

    sessionStorage.setItem("booking", JSON.stringify(payload));
    navigate(`/booking/${slug}/confirmation`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* HERO */}
      <div className="mt-6 h-72 sm:h-96 w-full overflow-hidden shadow-md relative rounded-2xl">
        <img
          src={business?.coverImage}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black">
            {business?.business_name}
          </h1>

          <p className="text-sm sm:text-md text-black/70 max-w-2xl mt-2 sm:mt-4 font-medium">
            {business?.description}
          </p>

          <p className="text-xs sm:text-sm text-black flex items-center gap-1 mt-2 sm:mt-4 font-thin">
            <MapPin className="w-4" />
            {business?.address}
          </p>


        </div>
      </div>

      {/* GRID */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-10 sm:mt-20 items-start">
        {!services || services?.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[60vh]">
            <NoService />
          </div>
        ) : (
          <>
            {/* LEFT */}
            <div className="w-full rounded-lg p-4">
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
                {paginatedServices.map((item: any) => (
                  <ServiceCard
                    key={item.id}
                    service={item}
                    serviceSelected={serviceSelected}
                    onSelect={() => {
                      setServiceSelected(item.id);

                      // RESET DEPENDENT FIELDS
                      setSelectedStaff("");
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-8 flex-wrap">
                  <button
                    className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded cursor-pointer ${
                        currentPage === index + 1
                          ? "bg-[#3525cc] text-white"
                          : "border"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-full min-w-0 border border-gray-300 shadow-xl rounded-lg p-4">
              <AppointmentCard
                staffs={staffs}
                selectedStaff={selectedStaff}
                onStaffSelect={setSelectedStaff}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
                availableTimes={isDateSelected ? timeSlots : []}
                onSelectTime={setSelectedTime}
                selectedTime={selectedTime}
                isServiceSelected={isServiceSelected}
                isStaffSelected={isStaffSelected}
                businessHours={businessHours}
              />

              <div className="w-full border border-gray-300 mt-10" />

              {serviceSelected &&
                selectedStaff &&
                selectedDate &&
                selectedTime && (
                  <>
                    <div className="flex flex-col mt-10">
                      <div className="flex justify-between">
                        <p>{serviceDetails?.service_name}</p>
                        <p>{serviceDetails?.price}</p>
                      </div>

                      <div className="flex justify-between">
                        <p>Total</p>
                        <p>{serviceDetails?.price}</p>
                      </div>
                    </div>

                    <Button
                      name="Continue to details"
                      className="mt-4 w-full cursor-pointer"
                      onClick={handleSubmit}
                    />
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   APPOINTMENT CARD
========================= */

type AppointmentCardProps = {
  staffs: AssignedStaff[];
  selectedStaff: string;
  onStaffSelect: (value: string) => void;

  onSelectDate: (value: string) => void;
  selectedDate: string;

  availableTimes: any[];
  onSelectTime: (value: string) => void;
  selectedTime: string;

  isServiceSelected: boolean;
  isStaffSelected: boolean;

  businessHours: GetBusinessHoursResponse;
};

function AppointmentCard({
  staffs,
  selectedStaff,
  onStaffSelect,

  onSelectDate,
  selectedDate,

  availableTimes,
  onSelectTime,
  selectedTime,

  isServiceSelected,
  isStaffSelected,

  businessHours,
}: AppointmentCardProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-medium text-black">Schedule Appointment</h1>

      {/* STAFF */}
      {!isServiceSelected ? (
        <p className="text-sm text-gray-400 mt-4">Select a service first</p>
      ) : (
        <StaffSection
          staffs={staffs}
          selectedStaff={selectedStaff}
          onSelect={onStaffSelect}
        />
      )}

      {/* DATE */}
      {!isStaffSelected ? (
        <p className="text-sm text-gray-400 mt-6"></p>
      ) : (
        <DateSection
          onSelectDate={onSelectDate}
          selectedDate={selectedDate}
          businessHours={businessHours}
        />
      )}

      {/* TIME */}
      {!selectedDate ? (
        <p className="text-sm text-gray-400 mt-6"></p>
      ) : (
        <AvailableTimes
          availableTime={availableTimes}
          onSelectTime={onSelectTime}
          selectedTime={selectedTime}
        />
      )}
    </div>
  );
}

/* =========================
   STAFF
========================= */

type StaffProps = {
  staffs: any[];
  onSelect: (value: string) => void;
  selectedStaff: string;
};

function StaffSection({ staffs, onSelect, selectedStaff }: StaffProps) {
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = 7;

  // ✅ Fallback check
  const hasStaff = staffs && staffs.length > 0;

  const totalPages = Math.ceil((staffs?.length || 0) / ITEMS_PER_PAGE);

  const start = page * ITEMS_PER_PAGE;
  const visibleStaffs = staffs?.slice(start, start + ITEMS_PER_PAGE);

  const next = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const back = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="mt-6 flex flex-col">
      <h1 className="font-medium text-xs">Select Staff</h1>

      {/* EMPTY STATE */}
      {!hasStaff ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-black/50">No staff available yet</p>
          <p className="text-xs text-black/40 mt-1">
            The business has not added any staff members yet.
          </p>
        </div>
      ) : (
        <>
          {/* STAFF LIST */}
          <div className="flex items-center gap-2 mt-2">
            {/* BACK BUTTON */}
            {staffs?.length > 7 && (
              <button
                onClick={back}
                disabled={page === 0}
                className="p-1 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* STAFF ITEMS */}
            <div className="flex gap-4">
              {visibleStaffs?.map((staff: AssignedStaff) => {
                const isSelected = selectedStaff === staff.staff_id;

                return (
                  <div
                    key={staff.staff_id}
                    onClick={() => onSelect(staff.staff_id)}
                    className="flex flex-col items-center"
                  >
                    {staff.staff.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_IMAGE_PREFIX}${staff.staff.avatar}`}
                        className={`w-10 h-10 rounded-full cursor-pointer opacity-60 ${
                          isSelected ? "opacity-100 ring-2 ring-blue-500" : ""
                        }`}
                      />
                    ) : (
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/50 text-bold font-medium cursor-pointer opacity-60 ${
                          isSelected ? "opacity-100 ring-2 ring-blue-500" : ""
                        }`}
                      >
                        {getInitials(
                          staff.staff.first_name,
                          staff.staff.last_name,
                        )}
                      </div>
                    )}

                    <p
                      className={`text-xs ${
                        isSelected ? "text-black" : "text-black/50"
                      }`}
                    >
                      {staff.staff.first_name} {staff.staff.last_name}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* NEXT BUTTON */}
            {staffs?.length > 7 && (
              <button
                onClick={next}
                disabled={page === totalPages - 1}
                className="p-1 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
/* =========================
   DATE SECTION (UNCHANGED UI)
========================= */

type DateSectionProps = {
  onSelectDate: (value: string) => void;
  selectedDate: string;
  businessHours: GetBusinessHoursResponse;
};

function DateSection({
  onSelectDate,
  selectedDate,
  businessHours,
}: DateSectionProps) {
  const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();

    const diff = newDate.getDate() - day + 1;
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-gray-700">
          {currentWeekStart.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div>
          <button onClick={goPrevWeek}>
            <ChevronLeft />
          </button>

          <button onClick={goNextWeek}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayName = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
          })
            .format(day)
            .toUpperCase();

          const isClosed = businessHours.some(
            (item) => item.day === dayName && item.is_closed,
          );

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
                if (isPastDay || isClosed) return;
                const normalizedDate = new Date(day);
                normalizedDate.setUTCHours(0, 0, 0, 0);
                onSelectDate(normalizedDate.toISOString());
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                isSelectedDate ? "bg-[#3525cc] text-white" : ""
              } ${
                isPastDay || isClosed
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span
                className={`text-xs text-gray-500 ${
                  isSelectedDate ? "text-white" : ""
                }`}
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

/* =========================
   TIMES
========================= */

type AvailableTimesProps = {
  availableTime: any;
  onSelectTime: (value: string) => void;
  selectedTime: string;
};

function AvailableTimes({
  availableTime,
  onSelectTime,
  selectedTime,
}: AvailableTimesProps) {
  return (
    <div className="mt-6">
      <h1 className="mb-2 text-xs font-medium">Available Times</h1>

      <div className="grid grid-cols-3 gap-3">
        {availableTime?.map((time: string, index: number) => {
          const isSelected = selectedTime === time;

          return (
            <button
              key={index}
              className={`border rounded-lg py-2 text-sm hover:bg-gray-100 transition cursor-pointer font-medium ${
                isSelected ? "bg-[#e7e3fa] text-[#3525cc]" : ""
              }`}
              onClick={() => onSelectTime(time)}
            >
              {convertTo12Hours(time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
