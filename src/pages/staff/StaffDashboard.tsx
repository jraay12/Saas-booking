import React from "react";
import { useAuth } from "../../provider/AuthProvider";
import { getTodayFormatted, getTodayGreeting } from "../../utils/formatters";
import { CalendarDays, Check, Clock, Sparkles, X } from "lucide-react";
import StatCard from "../../component/StatCard";

const StaffDashboard = () => {
  const { isLoading, user } = useAuth();
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
          value={18}
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
          trend="+12%"
        />
        <StatCard
          label="Pending Confirmation"
          value={18}
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
          value={18}
          sub="Of 18 Today"
          accentFrom="#BA7517"
          accentTo="#EF9F27"
          iconBg="bg-green-50"
          icon={
            <Check size={18} className="text-green-600" strokeWidth={1.75} />
          }
        />
        <StatCard
          label="Cancellations"
          value={18}
          sub="This week"
          accentFrom="#0F6E56"
          accentTo="#1D9E75"
          iconBg="bg-red-50"
          icon={
            <X size={18} className="text-red-600" strokeWidth={1.75} />
          }
        />
      </div>
    </div>
  );
};

export default StaffDashboard;
