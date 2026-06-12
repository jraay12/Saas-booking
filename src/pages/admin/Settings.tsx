import { useEffect, useState } from "react";
import {
  Clock,
  Copy,
  Check,
  Globe,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
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

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const DAY_INITIAL: Record<string, string> = {
  MONDAY: "M",
  TUESDAY: "T",
  WEDNESDAY: "W",
  THURSDAY: "T",
  FRIDAY: "F",
  SATURDAY: "S",
  SUNDAY: "S",
};

const DEFAULT_SCHEDULE: DaySchedule = {
  schedules: DAYS.map((day) => ({
    day,
    open_time: "08:00",
    close_time: "17:00",
    is_closed: false,
  })),
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
};

const Settings = () => {
  const [active, setActive] = useState("hours");

  const createBusinessHoursMutation = useCreateBusinessHours();

  // Defensive destructure — tolerate hooks that may or may not expose
  // `error` / `refetch` without breaking the component.
  const businessHoursQuery = useGetBusinessHours() as {
    data?: GetBusinessHoursResponse;
    isLoading: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
  };

  const {
    data: fetchBusinessHours,
    isLoading,
    isError,
    error,
    refetch,
  } = businessHoursQuery ?? {};

  // BOOKING SITE STATE
  const [bookingUrl, setBookingUrl] = useState(
    "https://your-booking-site.com/demo",
  );
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy link", {
        description: "Your browser blocked clipboard access. Copy it manually instead.",
        richColors: true,
        position: "top-right",
      });
    }
  };

  const handleSubmit = (data: any) => {
    createBusinessHoursMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Business hours saved", {
          description: "Your availability has been updated.",
          richColors: true,
          position: "top-right",
        });
      },
      onError: (error: any) => {
        toast.error("Couldn't save changes", {
          description:
            error?.response?.data?.message ??
            "Something went wrong while saving your business hours. Please try again.",
          richColors: true,
          position: "top-right",
        });
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto bg-zinc-50 min-h-full">
      <div className="mx-auto">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold text-zinc-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your availability and booking page.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex items-center gap-1 p-1 rounded-full bg-zinc-200/60 border border-zinc-200">
          {tabs.map((item) => {
            const isActive = active === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActive(item.value)}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-[#3525cc] shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {active === "hours" && (
            <BusinessHoursTab
              onSubmit={handleSubmit}
              businessHoursData={fetchBusinessHours}
              isLoading={isLoading}
              isError={Boolean(isError || error)}
              onRetry={() => refetch?.()}
              isSaving={createBusinessHoursMutation?.isPending}
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
        </div>
      </div>

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
  isError,
  onRetry,
  isSaving,
}: {
  onSubmit: any;
  businessHoursData?: GetBusinessHoursResponse;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isSaving?: boolean;
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
          toast.error("Invalid time range", {
            description: "Close time cannot be earlier than open time.",
            richColors: true,
            position: "top-right",
          });
          return d;
        }

        return updated;
      }),
    );
  };

  const toggleDay = (i: number) => {
    updateDay(i, "is_closed", !schedule[i].is_closed);
  };

  const openDaysCount = schedule.filter((d) => !d.is_closed).length;

  /* ---- LOADING: skeleton state ---- */
  if (isLoading) {
    return (
      <div>
        <SectionHeader />

        <div className="bg-white mt-5 p-4 sm:p-6 rounded-2xl border border-zinc-200/70 shadow-sm">
          {/* Skeleton overview strip */}
          <div className="flex items-center gap-2 pb-5 mb-5 border-b border-zinc-100">
            {DAYS.map((d) => (
              <div
                key={d}
                className="h-9 w-9 rounded-full bg-zinc-100 animate-pulse"
              />
            ))}
          </div>

          {/* Skeleton rows */}
          <div className="divide-y divide-zinc-100">
            {DAYS.map((d) => (
              <div
                key={d}
                className="flex flex-col sm:flex-row sm:items-center gap-3 py-4"
              >
                <div className="h-4 w-20 rounded bg-zinc-100 animate-pulse" />
                <div className="h-5 w-10 rounded-full bg-zinc-100 animate-pulse" />
                <div className="flex gap-2 flex-1">
                  <div className="h-8 w-28 rounded-lg bg-zinc-100 animate-pulse" />
                  <div className="h-8 w-28 rounded-lg bg-zinc-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 h-9 w-32 rounded-lg bg-zinc-100 animate-pulse" />
        </div>
      </div>
    );
  }

  /* ---- ERROR: fallback state ---- */
  if (isError) {
    return (
      <div>
        <SectionHeader />

        <div className="bg-white mt-5 p-8 rounded-2xl border border-zinc-200/70 shadow-sm">
          <div className="flex flex-col items-center text-center gap-3 py-10">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              Couldn't load your business hours
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              There was a problem fetching your schedule. Check your
              connection and try again.
            </p>
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- LOADED ---- */
  return (
    <div>
      <SectionHeader />

      <div className="bg-white mt-5 p-4 sm:p-6 rounded-2xl border border-zinc-200/70 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold text-base sm:text-lg text-zinc-900">
              Weekly schedule
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {openDaysCount} of 7 days open for bookings
            </p>
          </div>

          {/* Week-at-a-glance overview */}
          <div className="flex items-center gap-1.5">
            {schedule.map((d) => (
              <div
                key={d.day}
                title={
                  d.is_closed
                    ? `${DAY_SHORT[d.day]}: Closed`
                    : `${DAY_SHORT[d.day]}: ${formatTime(d.open_time)} – ${formatTime(d.close_time)}`
                }
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                  ${
                    d.is_closed
                      ? "bg-zinc-100 text-zinc-400"
                      : "bg-[#3525cc]/10 text-[#3525cc]"
                  }
                `}
              >
                {DAY_INITIAL[d.day]}
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-zinc-100 mt-5">
          {schedule.map((d, i) => (
            <div
              key={d.day}
              className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 first:pt-4"
            >
              <div className="flex items-center gap-3 w-28 sm:w-32 shrink-0">
                {d.is_closed ? (
                  <Moon size={15} className="text-zinc-300" />
                ) : (
                  <Sun size={15} className="text-[#3525cc]" />
                )}
                <span className="text-sm font-medium text-zinc-700">
                  {DAY_SHORT[d.day]}
                </span>
              </div>

              <Toggle on={!d.is_closed} onChange={() => toggleDay(i)} />

              {!d.is_closed ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                  <TimeInput
                    value={d.open_time}
                    onChange={(value) => updateDay(i, "open_time", value)}
                  />
                  <span className="text-zinc-300 text-sm hidden sm:block">
                    to
                  </span>
                  <TimeInput
                    value={d.close_time}
                    onChange={(value) => updateDay(i, "close_time", value)}
                  />
                </div>
              ) : (
                <span className="text-sm text-zinc-400 inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-50">
                  Closed
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() =>
              onSubmit({
                schedules: schedule,
              })
            }
            disabled={isSaving}
            className="bg-[#3525cc] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSaving && (
              <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-[#3525cc]">
        Availability
      </span>
      <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
        Availability settings
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Configure when you're available for bookings.
      </p>
    </div>
  );
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <Clock
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-sm w-full sm:w-36 bg-zinc-50 focus:bg-white focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/15 outline-none transition-colors"
      />
    </div>
  );
}

/* ---------------- BOOKING SITE ---------------- */

function BookingSiteTab({ bookingUrl, setBookingUrl, copyLink, copied }: any) {
  const displayUrl = bookingUrl?.replace(/^https?:\/\//, "") || "";

  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#3525cc]">
          Public page
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
          Booking site
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Share this link so clients can book appointments with you directly.
        </p>
      </div>

      {/* Browser-style preview */}
      <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border-b border-zinc-100">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
          <div className="ml-2 flex-1 flex items-center gap-1.5 bg-white border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-500 truncate">
            <Globe size={12} className="text-zinc-400 shrink-0" />
            <span className="truncate">{displayUrl || "your-booking-site.com"}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center gap-2 py-6">
            <div className="w-12 h-12 rounded-full bg-[#3525cc]/10 flex items-center justify-center">
              <Globe size={20} className="text-[#3525cc]" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">
              This is your booking page
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs">
              Customers who visit this link can view your availability and
              book time with you.
            </p>
          </div>
        </div>
      </div>

      {/* URL editor */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200/70 shadow-sm space-y-3">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Public booking URL
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Globe
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              className="border border-zinc-200 rounded-lg pl-9 pr-3 py-2.5 w-full text-sm bg-zinc-50 focus:bg-white focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/15 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-w-[96px]
                ${
                  copied
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }
              `}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>

            
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
            <a>
              <ExternalLink size={14} />
              Visit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TOGGLE ---------------- */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={`relative w-10 h-5.5 h-[22px] w-[40px] rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3525cc]/30 ${
        on ? "bg-[#3525cc]" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}