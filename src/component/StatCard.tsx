import { ArrowUpRight } from "lucide-react";

/**
 * StatCard — summary metric tile used in the top KPI row.
 */
export default function StatCard({
  label,
  value,
  sub,
  icon,
  accentFrom,
  accentTo,
  iconBg,
  trend,
}: any) {
  return (
    <div className="relative bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Gradient top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
        }}
      />

      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`${iconBg} p-2.5 rounded-xl`}>{icon}</div>
          {trend && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={10} strokeWidth={2.5} />
              {trend}
            </span>
          )}
        </div>

        <p className="text-3xl font-bold text-zinc-900 tracking-tight leading-none mb-1">
          {value}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}
