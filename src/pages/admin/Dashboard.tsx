import {
  CalendarDays,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import StatCard from "../../component/StatCard";
import RevenueChart from "../../component/RevenueChart";
import StatusDonutChart from "../../component/StatusDonutChart";
import TodaySchedule from "../../component/TodaySchedule";
import StaffUtilization from "../../component/StaffUtilization";
import TopServices from "../../component/TopServices";

import { TODAY_SCHEDULE, RECENT_BOOKINGS } from "../../data/mockdata";
import { getTodayGreeting, getTodayFormatted } from "../../utils/formatters";

/**
 * Dashboard — top-level layout combining all dashboard panels.
 */
export default function Dashboard() {
  const confirmedToday = TODAY_SCHEDULE.filter(
    (s) => s.status === "CONFIRMED"
  ).length;

  const pendingToday = TODAY_SCHEDULE.filter(
    (s) => s.status === "PENDING"
  ).length;

  const totalRevenue = RECENT_BOOKINGS.filter(
    (b) => b.status === "COMPLETED"
  ).reduce((sum, b) => sum + parseFloat(b.service_price), 0);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto space-y-6">

        {/* ── Hero Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-indigo-500" strokeWidth={2} />
              <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">
                {getTodayGreeting()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Here's what's happening today
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{getTodayFormatted()}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3">
            <CalendarDays size={15} className="text-indigo-500" strokeWidth={2} />
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Today
              </p>
              <p className="text-[13px] font-semibold text-indigo-900">
                {TODAY_SCHEDULE.length} appointments
              </p>
            </div>
          </div>
        </div>

        {/* ── KPI Stat Cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total bookings"
            value={TODAY_SCHEDULE.length}
            sub="Scheduled today"
            accentFrom="#534AB7"
            accentTo="#7F77DD"
            iconBg="bg-indigo-50"
            icon={<CalendarDays size={18} className="text-indigo-600" strokeWidth={1.75} />}
            trend="+12%"
          />
          <StatCard
            label="Confirmed"
            value={confirmedToday}
            sub="Ready to go"
            accentFrom="#185FA5"
            accentTo="#378ADD"
            iconBg="bg-blue-50"
            icon={<CheckCircle2 size={18} className="text-blue-600" strokeWidth={1.75} />}
            trend={null}
          />
          <StatCard
            label="Pending"
            value={pendingToday}
            sub="Awaiting confirmation"
            accentFrom="#BA7517"
            accentTo="#EF9F27"
            iconBg="bg-amber-50"
            icon={<Clock size={18} className="text-amber-600" strokeWidth={1.75} />}
            trend={null}
          />
          <StatCard
            label="Revenue"
            value={`₱${totalRevenue.toLocaleString("en-PH")}`}
            sub="From completed bookings"
            accentFrom="#0F6E56"
            accentTo="#1D9E75"
            iconBg="bg-emerald-50"
            icon={<TrendingUp size={18} className="text-emerald-600" strokeWidth={1.75} />}
            trend="+8%"
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <StatusDonutChart />
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TodaySchedule />
          <TopServices />
        </div>

      </div>
    </div>
  );
}
