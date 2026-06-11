import { CalendarDays } from "lucide-react";
import StatusBadge from "./StatusBadges";
import { STATUS_CONFIG } from "../utils/statusConfig";
import { convertTo12Hours } from "../utils/convertTimeTo12";

interface Props {
  TODAY_SCHEDULE: {
    id: string;
    time: string;
    client: string;
    service: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    duration: string;
    staff: string;
  }[];
}

export default function TodaySchedule({ TODAY_SCHEDULE }: Props) {
  const isEmpty = TODAY_SCHEDULE.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Today's schedule</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {isEmpty ? "No appointments" : `${TODAY_SCHEDULE.length} appointments`}
          </p>
        </div>
        <CalendarDays size={16} className="text-zinc-300" strokeWidth={1.75} />
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <CalendarDays size={18} className="text-zinc-300" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-zinc-400">No appointments today</p>
            <p className="text-[11px] text-zinc-300 mt-0.5">Enjoy the free time</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {TODAY_SCHEDULE.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <span className="text-[11px] font-medium text-zinc-400 min-w-[52px]">
                  {convertTo12Hours(item.time)}
                </span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 truncate">
                    {item.client}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {item.service} · {item.staff}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}