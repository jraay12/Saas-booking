import { useState } from "react";
import Cards from "../../component/Cards";
import { StatusBadge } from "../../component/StatusBadge";
import Table from "../../component/Table";
import { Phone, X } from "lucide-react";

const data = [
  {
    customer: "Alex Johnson",
    service: "Men's Haircut",
    staff: "Sarah Jenkins",
    date: "Oct 24, 2023",
    time: "10:00 AM - 11:00 AM",
    status: "Cancelled",
    payment: "$45.00",
  },
  {
    customer: "Alex Johnson",
    service: "Men's Haircut",
    staff: "Sarah Jenkins",
    date: "Oct 24, 2023",
    time: "10:00 AM - 11:00 AM",
    status: "Pending",
    payment: "$45.00",
  },
  {
    customer: "Alex Johnson",
    service: "Men's Haircut",
    staff: "Sarah Jenkins",
    date: "Oct 24, 2023",
    time: "10:00 AM - 11:00 AM",
    status: "Completed",
    payment: "$45.00",
  },
];

const columns = [
  { header: "Customer", accessor: "customer" },
  {
    header: "Service & Staff",
    accessor: "service",
    render: (row: any) => (
      <div>
        <p className="font-medium">{row.service}</p>
        <p className="text-xs text-gray-500">with {row.staff}</p>
      </div>
    ),
  },
  {
    header: "Date & Time",
    accessor: "date",
    render: (row: any) => (
      <div>
        <p>{row.date}</p>
        <p className="text-xs text-gray-500">{row.time}</p>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row: any) => <StatusBadge status={row.status} />,
  },
  {
    header: "Payment",
    accessor: "payment",
    render: (row: any) => (
      <div>
        <p>{row.payment}</p>
        <p className="text-xs text-gray-500">unpaid</p>
      </div>
    ),
  },
];

const Bookings = () => {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="relative overflow-y-auto">
      <h1 className="text-3xl font-semibold">Bookings</h1>
      <p className="text-black/50">Manage and track all service appointments</p>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Cards variant="total" value={123} />
        <Cards variant="pending" value={123} />
        <Cards variant="confirmed" value={123} />
        <Cards variant="completed" value={123} />
        <Cards variant="canceled" value={123} />
      </div>

      {/* Table */}
      <div className="mt-10">
        <Table
          columns={columns}
          data={data}
          onRowClick={(row: any) => setSelected(row)}
        />
      </div>

      {/* SIDE PANEL */}
      <SidePanel selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Bookings;


function SidePanel({
  selected,
  onClose,
}: {
  selected: any;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        selected ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/35 transition-opacity ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-[100dvh] w-[300px] bg-white border-l border-zinc-200 text-black shadow-xl flex flex-col transform transition-transform duration-300 ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-[18px] py-4 border-b border-zinc-100 shrink-0">
              <div>
                <p className="text-[15px] font-medium text-zinc-900">
                  Booking Details
                </p>
                <p className="text-[12px] text-zinc-400 mt-0.5">#BK-88392</p>
              </div>

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-[18px] py-4 flex flex-col gap-4">
              {/* Status */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                    Current Status
                  </span>
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2 py-0.5">
                    Pending Confirmation
                  </span>
                </div>
                <p className="text-[12px] text-zinc-500">
                  Awaiting staff confirmation for this time slot.
                </p>
              </div>

              {/* Customer */}
              <div>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2.5">
                  Customer
                </p>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[12px] font-medium text-blue-600 shrink-0">
                    AJ
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-zinc-900">
                      Alex Johnson
                    </p>
                    <p className="text-[12px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <Phone size={11} /> +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment */}
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2.5">
                  Appointment
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Service", value: selected.service },
                    { label: "Staff Member", value: selected.staff },
                    { label: "Date", value: selected.date },
                    { label: "Time", value: selected.time },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[11px] text-zinc-400 mb-0.5">
                        {label}
                      </p>
                      <p className="text-[13px] font-medium text-zinc-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2.5">
                  Payment
                </p>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[13px] text-zinc-500">
                    <span>Subtotal</span>
                    <span>$45.00</span>
                  </div>

                  <div className="flex justify-between text-[13px] text-zinc-500">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-100 pt-2 mt-1">
                    <span className="text-[14px] font-medium text-zinc-900">
                      Total
                    </span>

                    <div className="text-right">
                      <span className="text-[14px] font-medium text-zinc-900 block">
                        $45.00
                      </span>
                      <span className="text-[11px] font-medium text-red-500">
                        Unpaid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions (FIXED) */}
            <div className="px-[18px] py-3.5 border-t border-zinc-100 flex flex-col gap-2 shrink-0 bg-white">
              <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors cursor-pointer">
                Confirm Booking
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-[13px] text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
                  Reschedule
                </button>

                <button className="py-2 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-500 hover:bg-red-100 transition-colors cursor-pointer">
                  Reject
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

