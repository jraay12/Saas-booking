import { useState } from "react";
import { useChart } from "../hooks/useChart";
import { REVENUE_DATA } from "../data/mockdata";

/**
 * RevenueChart — line chart showing daily/weekly revenue vs target.
 * Uses the `useChart` hook which imports Chart.js from npm (no CDN script tag).
 */
interface RevenueChart {
  labels: string[];
  revenue: number[];
  target: number[];
}

interface Props {
  REVENUE_DATA: {
    "7d": RevenueChart;
    "30d": RevenueChart;
  };
}
export default function RevenueChart({ REVENUE_DATA }: Props) {
  const [period, setPeriod] = useState<keyof typeof REVENUE_DATA>("7d");

  const { canvasRef } = useChart(() => {
    const d = REVENUE_DATA[period];
    console.log(d)
    return {
      type: "line",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "Revenue",
            data: d.revenue,
            borderColor: "#534AB7",
            backgroundColor: "rgba(83,74,183,0.08)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#534AB7",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Target",
            data: d.target,
            borderColor: "#1D9E75",
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ₱${ctx.parsed.y.toLocaleString("en-PH")}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: "#888780" },
          },
          y: {
            grid: { color: "rgba(136,135,128,0.12)" },
            ticks: {
              font: { size: 11 },
              color: "#888780",
              callback: (v: any) =>
                "₱" + (v >= 1000 ? Math.round(v / 1000) + "k" : v),
            },
          },
        },
      },
    };
  }, [period]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Weekly revenue</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {period === "7d" ? "Last 7 days" : "Last 30 days"} · Philippine Peso
          </p>
        </div>
        <div className="flex gap-1.5">
          {(["7d", "30d"] as Array<keyof typeof REVENUE_DATA>).map(
            (p: keyof typeof REVENUE_DATA) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                  period === p
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                    : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          Revenue
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span
            className="w-2.5 h-2.5 rounded-sm border"
            style={{ borderColor: "#1D9E75", borderStyle: "dashed" }}
          />
          Target
        </span>
      </div>

      {/* Canvas */}
      <div className="relative w-full" style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
