import { useChart } from "../hooks/useChart";
import { HOURLY_DATA } from "../data/mockdata";

/**
 * HourlyChart — small bar chart showing appointment density by hour today.
 */
export default function HourlyChart() {
  const { canvasRef } = useChart(() => ({
    type: "bar",
    data: {
      labels: HOURLY_DATA.labels,
      datasets: [
        {
          label: "Appointments",
          data: HOURLY_DATA.data,
          backgroundColor: "#CECBF6",
          borderColor: "#534AB7",
          borderWidth: 1.5,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 9 }, color: "#888780" },
        },
        y: {
          display: false,
          grid: { display: false },
          min: 0,
          max: 2,
          ticks: { stepSize: 1 },
        },
      },
    },
  }), []);

  return (
    <div className="relative w-full" style={{ height: 100 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
