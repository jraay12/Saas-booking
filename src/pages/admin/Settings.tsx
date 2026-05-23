import { useState } from "react";
import { Clock, Plus, X, Copy } from "lucide-react";

const tabs = [
  { label: "Business Hours", value: "hours" },
  { label: "Booking Site", value: "site" },
];

type DaySchedule = {
  enabled: boolean;
  start: string;
  end: string;
  breaks: { start: string; end: string }[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map((_, i) => ({
  enabled: i < 5,
  start: "09:00",
  end: "17:00",
  breaks: [],
}));

const Settings = () => {
  const [active, setActive] = useState("hours");

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
    console.log("SUBMIT SETTINGS:", data);
    // 🔥 send to API here
  };

  return (
    <div className="p-4 sm:p-6 overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>

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
        <BusinessHoursTab onSubmit={handleSubmit} />
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
  );
};

export default Settings;

/* ---------------- BUSINESS HOURS ---------------- */

function BusinessHoursTab({ onSubmit }: { onSubmit: any }) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DEFAULT_SCHEDULE,
  );

  const updateDay = (i: number, key: keyof DaySchedule, value: any) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)),
    );
  };

  const toggleDay = (i: number) => {
    updateDay(i, "enabled", !schedule[i].enabled);
  };

  const updateBreak = (
    dayIdx: number,
    breakIdx: number,
    key: "start" | "end",
    value: string,
  ) => {
    const updated = [...schedule];
    updated[dayIdx].breaks[breakIdx][key] = value;
    setSchedule(updated);
  };

  const addBreak = (i: number) => {
    const updated = [...schedule];
    updated[i].breaks.push({ start: "12:00", end: "13:00" });
    setSchedule(updated);
  };

  const removeBreak = (dayIdx: number, breakIdx: number) => {
    const updated = [...schedule];
    updated[dayIdx].breaks.splice(breakIdx, 1);
    setSchedule(updated);
  };

  return (
    <div className="mt-6">
      <h1 className="text-xl sm:text-2xl font-medium">
        Availability Settings
      </h1>
      <p className="text-black/50 text-sm">
        Configure when you are available for bookings.
      </p>

      <div className="bg-white mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl border border-zinc-100">
        <h2 className="font-medium text-lg sm:text-xl">
          Weekly Schedule
        </h2>

        <div className="divide-y divide-zinc-100 mt-4">
          {DAYS.map((day, i) => {
            const d = schedule[i];

            return (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-start gap-3 py-4"
              >
                <span className="w-10 text-sm font-medium text-zinc-700 pt-1">
                  {day}
                </span>

                <Toggle
                  on={d.enabled}
                  onChange={() => toggleDay(i)}
                />

                {d.enabled ? (
                  <div className="flex flex-col gap-2 flex-1">
                    {/* TIME ROW */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="time"
                        value={d.start}
                        onChange={(e) =>
                          updateDay(i, "start", e.target.value)
                        }
                        className="border border-zinc-200 rounded-lg px-2 py-1 text-sm w-full sm:w-auto"
                      />

                      <span className="text-zinc-400 hidden sm:block">
                        –
                      </span>

                      <input
                        type="time"
                        value={d.end}
                        onChange={(e) =>
                          updateDay(i, "end", e.target.value)
                        }
                        className="border border-zinc-200 rounded-lg px-2 py-1 text-sm w-full sm:w-auto"
                      />

                      {d.breaks.length === 0 && (
                        <button
                          onClick={() => addBreak(i)}
                          className="text-indigo-600 text-sm flex items-center gap-1"
                        >
                          <Plus size={14} /> Add break
                        </button>
                      )}
                    </div>

                    {/* BREAKS */}
                    {d.breaks.map((br, bi) => (
                      <div
                        key={bi}
                        className="flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} />
                          <input
                            type="time"
                            value={br.start}
                            onChange={(e) =>
                              updateBreak(
                                i,
                                bi,
                                "start",
                                e.target.value,
                              )
                            }
                            className="border rounded px-2 py-1"
                          />
                          –
                          <input
                            type="time"
                            value={br.end}
                            onChange={(e) =>
                              updateBreak(i, bi, "end", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </div>

                        <button
                          onClick={() => removeBreak(i, bi)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 pt-1">
                    Closed
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* SUBMIT */}
        <button
          onClick={() => onSubmit(schedule)}
          className="mt-6 bg-[#3525cc] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ---------------- BOOKING SITE ---------------- */

function BookingSiteTab({
  bookingUrl,
  setBookingUrl,
  copyLink,
  copied,
}: any) {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-medium">Booking Site</h2>

      <div className="bg-white p-4 rounded-xl border space-y-3">
        <label className="text-sm text-zinc-600">
          Public Booking URL
        </label>

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

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: () => void;
}) {
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