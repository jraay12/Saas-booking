import { useChart } from "../hooks/useChart";
import { STATUS_DONUT } from "../data/mockdata";

/**
 * StatusDonutChart — doughnut chart breaking down bookings by status this month.
 */
export default function StatusDonutChart() {
  const { canvasRef } = useChart(() => ({
    type: "doughnut",
    data: {
      labels: STATUS_DONUT.labels,
      datasets: [
        {
          data: STATUS_DONUT.data,
          backgroundColor: STATUS_DONUT.colors,
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false } },
    },
  }), []);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-800">Booking status</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">This month</p>
      </div>

      <div className="relative w-full" style={{ height: 160 }}>
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {STATUS_DONUT.labels.map((label, i) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: STATUS_DONUT.colors[i] }}
              />
              <span className="text-[12px] text-zinc-500">{label}</span>
            </div>
            <span className="text-[12px] font-semibold text-zinc-700">
              {STATUS_DONUT.data[i]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
