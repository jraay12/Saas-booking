import { useEffect, useState } from "react";
import { Clock, Plus, X, Copy } from "lucide-react";
import {
  useCreateBusinessHours,
  useGetBusinessHours,
} from "../../features/business/business.hook";
import type { GetBusinessHoursResponse } from "../../types/types";
import { toast, Toaster } from "sonner";
const tabs = [
  { label: "Business Hours", value: "hours" },
  { label: "Booking Site", value: "site" },
];

type DaySchedule = {
  schedules: {
    day: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }[];
};

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DEFAULT_SCHEDULE: DaySchedule = {
  schedules: DAYS.map((day) => ({
    day,
    open_time: "08:00",
    close_time: "17:00",
    is_closed: false,
  })),
};

const Settings = () => {
  const [active, setActive] = useState("hours");
  const createBusinessHoursMutation = useCreateBusinessHours();
  const { data: fetchBusinessHours, isLoading } = useGetBusinessHours();

  // BOOKING SITE STATE
  const [bookingUrl, setBookingUrl] = useState(
    "https://your-booking-site.com/demo",
  );
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (data: any) => {
    createBusinessHoursMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Business Hours Created", {
          description: "Your business hours have been saved successfully.",
          richColors: true,
          position: "top-right",
        });
      },
      onError: (error: any) => {
        toast.error("Failed to Save", {
          description:
            error?.response?.data?.message ?? "Unable to save business hours.",
          richColors: true,
          position: "top-right",
        });
      },
    });
  };
  return (
    <div className="p-4 sm:p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
        Settings
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 sm:gap-6 mt-4 border-b border-zinc-200 ">
        {tabs.map((item) => {
          const isActive = active === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setActive(item.value)}
              className={`relative pb-2 text-[14px] font-medium transition-all whitespace-nowrap
                ${
                  isActive
                    ? "text-[#3525cc]"
                    : "text-zinc-500 hover:text-[#3525cc]"
                }
              `}
            >
              {item.label}

              <span
                className={`absolute left-0 -bottom-[1px] h-[2px] bg-[#3525cc] transition-all duration-300
                  ${isActive ? "w-full" : "w-0"}
                `}
              />
            </button>
          );
        })}
      </div>

      {active === "hours" && (
        <BusinessHoursTab
          onSubmit={handleSubmit}
          businessHoursData={fetchBusinessHours}
          isLoading={isLoading}
        />
      )}

      {active === "site" && (
        <BookingSiteTab
          bookingUrl={bookingUrl}
          setBookingUrl={setBookingUrl}
          copyLink={copyLink}
          copied={copied}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Settings;

/* ---------------- BUSINESS HOURS ---------------- */

function BusinessHoursTab({
  onSubmit,
  businessHoursData,
  isLoading,
}: {
  onSubmit: any;
  businessHoursData: GetBusinessHoursResponse;
  isLoading: boolean;
}) {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE.schedules);

  useEffect(() => {
    if (businessHoursData?.length) {
      setSchedule(businessHoursData);
    }
  }, [businessHoursData]);

  const updateDay = (
    i: number,
    key: "open_time" | "close_time" | "is_closed",
    value: string | boolean,
  ) => {
    setSchedule((prev) =>
      prev.map((d, idx) => {
        if (idx !== i) return d;

        const updated = {
          ...d,
          [key]: value,
        };

        // VALIDATION
        if (
          updated.open_time &&
          updated.close_time &&
          updated.close_time < updated.open_time
        ) {
          alert("Close time cannot be earlier than open time");
          return d;
        }

        return updated;
      }),
    );
  };

  const toggleDay = (i: number) => {
    updateDay(i, "is_closed", !schedule[i].is_closed);
  };

  if (isLoading) {
    return (
      <div className="mt-6">
        <h1 className="text-xl sm:text-2xl font-medium">
          Availability Settings
        </h1>

        <p className="text-black/50 text-sm">
          Configure when you are available for bookings.
        </p>

        <div className="bg-white mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl border border-zinc-100">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#3525cc] rounded-full animate-spin" />

              <p className="text-sm text-zinc-500">Loading business hours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h1 className="text-xl sm:text-2xl font-medium">Availability Settings</h1>

      <p className="text-black/50 text-sm">
        Configure when you are available for bookings.
      </p>

      <div className="bg-white mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl border border-zinc-100">
        <h2 className="font-medium text-lg sm:text-xl">Weekly Schedule</h2>

        <div className="divide-y divide-zinc-100 mt-4">
          {schedule.map((d, i) => {
            return (
              <div
                key={d.day}
                className="flex flex-col sm:flex-row sm:items-start gap-3 py-4"
              >
                <span className="w-24 text-sm font-medium text-zinc-700 pt-1">
                  {d.day}
                </span>

                <Toggle on={!d.is_closed} onChange={() => toggleDay(i)} />

                {!d.is_closed ? (
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="time"
                        value={d.open_time}
                        onChange={(e) =>
                          updateDay(i, "open_time", e.target.value)
                        }
                        className="border border-zinc-200 rounded-lg px-2 py-1 text-sm w-full sm:w-auto"
                      />

                      <span className="text-zinc-400 hidden sm:block">–</span>

                      <input
                        type="time"
                        value={d.close_time}
                        onChange={(e) =>
                          updateDay(i, "close_time", e.target.value)
                        }
                        className="border border-zinc-200 rounded-lg px-2 py-1 text-sm w-full sm:w-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 pt-1">Closed</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() =>
            onSubmit({
              schedules: schedule,
            })
          }
          className="mt-6 bg-[#3525cc] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ---------------- BOOKING SITE ---------------- */

function BookingSiteTab({ bookingUrl, setBookingUrl, copyLink, copied }: any) {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-medium">Booking Site</h2>

      <div className="bg-white p-4 rounded-xl border space-y-3">
        <label className="text-sm text-zinc-600">Public Booking URL</label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />

          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm"
          >
            <Copy size={14} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TOGGLE ---------------- */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors mt-1 ${
        on ? "bg-indigo-600" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
