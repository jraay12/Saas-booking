import { useAuth } from "../../provider/AuthProvider";
import { getTodayFormatted, getTodayGreeting } from "../../utils/formatters";
import {
  CalendarDays,
  Check,
  Clock,
  Sparkles,
  X,
  CalendarX,
  ArrowRight,
} from "lucide-react";
import StatCard from "../../component/StatCard";
import TodaySchedule from "../../component/TodaySchedule";
import { useGetStaffDashboard } from "../../features/dashboard/dashboard.hook";
import { useEffect, useState } from "react";

const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-zinc-100 bg-white p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-3 w-24 bg-zinc-100 rounded" />
      <div className="h-8 w-8 bg-zinc-100 rounded-lg" />
    </div>
    <div className="h-7 w-14 bg-zinc-100 rounded mb-2" />
    <div className="h-3 w-20 bg-zinc-100 rounded" />
  </div>
);

const ScheduleSkeleton = () => (
  <div className="rounded-2xl border border-zinc-100 bg-white p-5 animate-pulse">
    <div className="h-4 w-32 bg-zinc-100 rounded mb-5" />
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-3 border-b border-zinc-50 last:border-0"
        >
          <div className="h-3 w-10 bg-zinc-100 rounded" />
          <div className="h-8 w-8 bg-zinc-100 rounded-full" />
          <div className="flex-1">
            <div className="h-3 w-32 bg-zinc-100 rounded mb-2" />
            <div className="h-3 w-24 bg-zinc-100 rounded" />
          </div>
          <div className="h-5 w-20 bg-zinc-100 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const NextAppointmentSkeleton = () => (
  <div className="col-span-4 xl:col-span-1 bg-zinc-100 rounded-2xl border border-zinc-100 row-span-2 p-4 animate-pulse">
    <div className="h-3 w-28 bg-zinc-200 rounded mb-4" />
    <div className="h-9 w-20 bg-zinc-200 rounded mb-4" />
    <div className="h-3 w-36 bg-zinc-200 rounded mb-6" />
    <div className="h-9 w-full bg-zinc-200 rounded-lg" />
  </div>
);

const StaffDashboard = () => {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashboardLoading } =
    useGetStaffDashboard();
  const [timeUntil, setTimeUntil] = useState("");

  const todaySchedule = dashboard?.TODAY_SCHEDULE ?? [];
  const nextAppointment = dashboard?.UPCOMING_BOOKING ?? null;

  useEffect(() => {
    if (!nextAppointment?.time) {
      setTimeUntil("");
      return;
    }

    const updateTime = () => {
      const [hours, minutes] = nextAppointment.time.split(":").map(Number);

      const appointmentDate = new Date();
      appointmentDate.setHours(hours, minutes, 0, 0);

      const diffMs = appointmentDate.getTime() - Date.now();

      if (diffMs <= 0) {
        setTimeUntil("Now");
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);

      const hoursLeft = Math.floor(totalSeconds / 3600);
      const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
      const secondsLeft = totalSeconds % 60;

      const formatted = [
        hoursLeft > 0 ? `${hoursLeft} ${hoursLeft === 1 ? "hr" : "hrs"}` : null,
        minutesLeft > 0
          ? `${minutesLeft} ${minutesLeft === 1 ? "min" : "mins"}`
          : null,
        `${secondsLeft} ${secondsLeft === 1 ? "sec" : "secs"}`,
      ]
        .filter(Boolean)
        .join(" ");

      setTimeUntil(formatted);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [nextAppointment?.time]);
 

  if (dashboardLoading) {
    return (
      <div>
        <div className="py-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 bg-zinc-100 rounded" />
            <div className="h-3 w-24 bg-zinc-100 rounded" />
          </div>
          <div className="h-7 w-72 bg-zinc-100 rounded mb-2" />
          <div className="h-3 w-40 bg-zinc-100 rounded" />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="mt-4 grid grid-rows-2 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3 col-span-4">
            <ScheduleSkeleton />
          </div>
          <NextAppointmentSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="py-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-indigo-500" strokeWidth={2} />
          <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">
            {getTodayGreeting()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Here's what's happening today, {user?.first_name}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">{getTodayFormatted()}</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total bookings"
          value={dashboard?.TOTAL_BOOKINGS ?? 0}
          sub="Scheduled today"
          accentFrom="#534AB7"
          accentTo="#7F77DD"
          iconBg="bg-indigo-50"
          icon={
            <CalendarDays
              size={18}
              className="text-indigo-600"
              strokeWidth={1.75}
            />
          }
          trend={dashboard?.TOTAL_BOOKINGS_TREND}
        />
        <StatCard
          label="Pending Confirmation"
          value={dashboard?.PENDING_CONFIRMATION ?? 0}
          sub="Needs review"
          accentFrom="#185FA5"
          accentTo="#378ADD"
          iconBg="bg-yellow-50"
          icon={
            <Clock size={18} className="text-yellow-600" strokeWidth={1.75} />
          }
        />
        <StatCard
          label="Checked In"
          value={dashboard?.CHECKED_IN ?? 0}
          sub={`Of ${dashboard?.TOTAL_BOOKINGS ?? 0} Today`}
          accentFrom="#BA7517"
          accentTo="#EF9F27"
          iconBg="bg-green-50"
          icon={
            <Check size={18} className="text-green-600" strokeWidth={1.75} />
          }
        />
        <StatCard
          label="Cancellations"
          value={dashboard?.CANCELLATIONS ?? 0}
          sub="This week"
          accentFrom="#0F6E56"
          accentTo="#1D9E75"
          iconBg="bg-red-50"
          icon={<X size={18} className="text-red-600" strokeWidth={1.75} />}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3">
          {todaySchedule.length > 0 ? (
            <TodaySchedule TODAY_SCHEDULE={todaySchedule} />
          ) : (
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 flex flex-col items-center justify-center text-center h-full min-h-55">
              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                <CalendarDays
                  size={18}
                  className="text-indigo-500"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-sm font-semibold text-zinc-700">
                No bookings scheduled today
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-65">
                Your schedule is clear for now. New bookings will show up here
                once customers book a slot with you.
              </p>
            </div>
          )}
        </div>
        <div className="xl:col-span-1 bg-[#3525cc] rounded-2xl border border-zinc-100 shadow-sm p-5 flex flex-col min-h-55">
          {nextAppointment ? (
            <div className="flex flex-col gap-4 h-full justify-between">
              <div>
                <h1 className="tracking-tight text-white/80 text-sm">
                  Next appointment in
                </h1>
                <p className="text-white text-3xl font-bold tracking-tighter mt-1">
                  {timeUntil}
                </p>
                <p className="text-white/90 mt-2 text-sm">
                  {nextAppointment.customer} - {nextAppointment.service_name}
                </p>
              </div>
              <button className="w-full bg-white text-[#3525cc] text-sm font-semibold rounded-lg py-2.5 flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors">
                View details
                <ArrowRight size={14} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <CalendarX
                  size={18}
                  className="text-white"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-sm font-semibold text-white">
                No upcoming appointments
              </h3>
              <p className="text-xs text-white/70 mt-1">
                You're all caught up for today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
