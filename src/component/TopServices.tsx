import { Award, Star } from "lucide-react";
import { formatPesoK } from "../utils/formatters";
import { TOP_SERVICES } from "../data/mockdata";
/**
 * TopServices — revenue-ranked list of services plus client retention stats.
 */
export default function TopServices() {
  const maxRev = Math.max(...TOP_SERVICES.map((s) => s.revenue));

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Top services</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">By revenue · this month</p>
        </div>
        <Award size={16} className="text-zinc-300" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-3">
        {TOP_SERVICES.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-zinc-300 min-w-[14px]">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-zinc-700 truncate">{s.name}</p>
              <div className="mt-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((s.revenue / maxRev) * 100)}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
            <span className="text-[12px] font-semibold text-zinc-500 min-w-[44px] text-right">
              {formatPesoK(s.revenue)}
            </span>
          </div>
        ))}
      </div>

      {/* Client Retention */}
      <div className="mt-5 pt-4 border-t border-zinc-100">
        <p className="text-[13px] font-semibold text-zinc-800 mb-3">
          Client retention
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-zinc-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-zinc-900">68%</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mt-0.5">
              Returning
            </p>
          </div>
          <div className="bg-zinc-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-zinc-900">32%</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mt-0.5">
              New clients
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-xl font-bold text-emerald-700 flex items-center justify-center gap-1">
            4.8{" "}
            <Star size={14} className="text-emerald-500 fill-emerald-400" />
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 mt-0.5">
            Avg. rating · 124 reviews
          </p>
        </div>
      </div>
    </div>
  );
}
