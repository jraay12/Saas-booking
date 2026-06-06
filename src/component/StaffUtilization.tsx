import { Users } from "lucide-react";
import HourlyChart from "./HourlyChart";
import { STAFF_DATA } from "../data/mockdata";

/**
 * StaffUtilization — shows each therapist's session count vs capacity for today,
 * plus an hourly demand bar chart below.
 */
export default function StaffUtilization() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Staff utilization</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Today's load</p>
        </div>
        <Users size={16} className="text-zinc-300" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-4">
        {STAFF_DATA.map((s) => {
          const pct = Math.round((s.sessions / s.max) * 100);
          return (
            <div key={s.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-700">
                  {s.name}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {s.sessions}/{s.max} sessions
                </span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-100">
        <p className="text-[13px] font-semibold text-zinc-800 mb-3">
          Hourly demand
        </p>
        <HourlyChart />
      </div>
    </div>
  );
}
