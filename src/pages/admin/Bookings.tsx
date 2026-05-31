import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  CalendarDays,
  Phone,
  X,
  CreditCard,
  ChevronRight,
  Search,
  Mail,
} from "lucide-react";
import {
  useCancelBooking,
  useFetchAllBookings,
} from "../../features/booking/booking.hook";
import type { Booking } from "../../types/types";
import { convertTo12Hours } from "../../utils/convertTimeTo12";
import { useConfirmBooking } from "../../features/booking/booking.hook";
// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "total" | "pending" | "confirmed" | "completed" | "canceled";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeStatus(status: string): string {
  return status.toLowerCase();
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
  canceled: {
    label: "Canceled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
};

// ─── Card config ──────────────────────────────────────────────────────────────

const CARD_CONFIG: Record<
  Variant,
  {
    label: string;
    Icon: React.ElementType;
    accent: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  total: {
    label: "Total Bookings",
    Icon: CalendarDays,
    accent: "from-indigo-500 to-violet-600",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-100",
  },
  pending: {
    label: "Pending",
    Icon: Clock,
    accent: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-100",
  },
  confirmed: {
    label: "Confirmed",
    Icon: CheckCircle2,
    accent: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-100",
  },
  completed: {
    label: "Completed",
    Icon: ClipboardList,
    accent: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-100",
  },
  canceled: {
    label: "Canceled",
    Icon: XCircle,
    accent: "from-red-400 to-rose-500",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    borderColor: "border-red-100",
  },
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ variant, value }: { variant: Variant; value: number }) {
  const cfg = CARD_CONFIG[variant];
  const { Icon } = cfg;

  return (
    <div
      className={`relative bg-white rounded-2xl border ${cfg.borderColor} shadow-sm overflow-hidden hover:shadow-md transition-all duration-200`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${cfg.accent}`}
      />
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              {cfg.label}
            </p>
            <p className="text-4xl font-bold text-zinc-900 tracking-tight leading-none">
              {value}
            </p>
          </div>
          <div className={`${cfg.iconBg} ${cfg.iconColor} p-2.5 rounded-xl`}>
            <Icon size={20} strokeWidth={1.75} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const key = normalizeStatus(status);
  const cfg = STATUS_CONFIG[key] ?? {
    label: status,
    dot: "bg-zinc-400",
    badge: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── SidePanel ────────────────────────────────────────────────────────────────

function SidePanel({
  selected,
  onClose,
  setSelected,
}: {
  selected: Booking | null;
  onClose: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Booking | null>>;
}) {
  const confirmBookingMutation = useConfirmBooking();
  const cancelBookingMutation = useCancelBooking();

  const handleConfirmBooking = () => {
    confirmBookingMutation.mutate(
      { id: selected?.id! },
      {
        onSuccess: () => {
          setSelected((prev: any) =>
            prev
              ? {
                  ...prev,
                  status: "CONFIRMED",
                }
              : null,
          );
        },
      },
    );
  };

  const handleCancelBooking = () => {
    cancelBookingMutation.mutate(
      { id: selected?.id! },
      {
        onSuccess: () => {
          setSelected((prev: any) =>
            prev
              ? {
                  ...prev,
                  status: "CANCELLED",
                }
              : null,
          );
        },
      },
    );
  };
  if (!selected) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300" />
        <div className="absolute right-0 top-0 h-[100dvh] w-[340px] bg-white border-l border-zinc-200/80 shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" />
      </div>
    );
  }

  const statusKey = normalizeStatus(selected.status);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 border-amber-200",
    confirmed: "bg-blue-50 border-blue-200",
    completed: "bg-emerald-50 border-emerald-200",
    cancelled: "bg-red-50 border-red-200",
    canceled: "bg-red-50 border-red-200",
  };

  const statusTextColors: Record<string, string> = {
    pending: "text-amber-700",
    confirmed: "text-blue-700",
    completed: "text-emerald-700",
    cancelled: "text-red-600",
    canceled: "text-red-600",
  };

  const statusMessages: Record<string, string> = {
    pending: "Awaiting staff confirmation for this slot.",
    confirmed: "Appointment confirmed and on schedule.",
    completed: "Service delivered successfully.",
    cancelled: "This appointment was cancelled.",
    canceled: "This appointment was canceled.",
  };

  const initials = getInitials(selected.first_name, selected.last_name);

  // Short booking reference from id
  const bookingRef =
    selected.id.length > 8
      ? `#${selected.id.slice(0, 8).toUpperCase()}`
      : `#${selected.id}`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 opacity-100"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-[100dvh] w-[340px] bg-white border-l border-zinc-200/80 shadow-2xl flex flex-col translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-zinc-900 tracking-tight">
              Booking Details
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
              {bookingRef}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Status banner */}
          <div
            className={`mx-4 mt-4 rounded-xl border px-4 py-3 ${
              statusColors[statusKey] ?? "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Status
              </span>
              <StatusBadge status={selected.status} />
            </div>
            <p
              className={`text-[12px] mt-1.5 ${
                statusTextColors[statusKey] ?? "text-zinc-500"
              }`}
            >
              {statusMessages[statusKey] ?? "No status information available."}
            </p>
          </div>

          {/* Customer */}
          <div className="px-5 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              Customer
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[13px] font-bold text-indigo-600 shrink-0 ring-2 ring-indigo-50">
                {initials}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-zinc-900">
                  {selected.first_name} {selected.last_name}
                </p>
                <p className="text-[12px] text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Phone size={10} strokeWidth={2} />
                  {selected.phone_number}
                </p>
                <p className="text-[12px] text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Mail size={10} strokeWidth={2} />
                  {selected.email_address}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment */}
          <div className="px-5 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              Appointment
            </p>
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 divide-y divide-zinc-100 overflow-hidden">
              {[
                {
                  label: "Service",
                  value: selected.service.service_name,
                },
                {
                  label: "Staff",
                  value: `${selected.staff.first_name} ${selected.staff.last_name}`,
                },
                {
                  label: "Date",
                  value: formatDate(selected.booking_date),
                },
                {
                  label: "Time",
                  value: convertTo12Hours(selected.start_time),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-[12px] text-zinc-400">{label}</span>
                  <span className="text-[12px] font-medium text-zinc-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {selected.aditional_notes && (
            <div className="px-5 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Additional Notes
              </p>
              <p className="text-[12px] text-zinc-600 bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3 leading-relaxed">
                {selected.aditional_notes}
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              Payment
            </p>
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden">
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CreditCard size={13} />
                  <span className="text-[12px]">Method</span>
                </div>
                <span className="text-[12px] font-medium text-zinc-800 capitalize">
                  {selected.payment_method.toLowerCase()}
                </span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-100">
                <span className="text-[12px] text-zinc-400">Subtotal</span>
                <span className="text-[12px] text-zinc-700">
                  ₱
                  {parseFloat(selected.service_price).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-zinc-900">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-[13px] font-bold text-zinc-900 block">
                    ₱
                    {parseFloat(selected.service_price).toLocaleString(
                      "en-PH",
                      { minimumFractionDigits: 2 },
                    )}
                  </span>
                  <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                    Unpaid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-zinc-100 bg-white flex flex-col gap-2 shrink-0">
          {statusKey === "pending" && (
            <button
              onClick={() => handleConfirmBooking()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-[13px] font-semibold transition-all duration-150 cursor-pointer"
            >
              Confirm Booking
            </button>
          )}
          {statusKey !== "canceled" && statusKey !== "cancelled" && (
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 active:scale-[0.98] text-[12px] font-medium text-zinc-700 transition-all duration-150 cursor-pointer">
                Reschedule
              </button>
              <button
                onClick={() => handleCancelBooking()}
                className="py-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 active:scale-[0.98] text-[12px] font-medium text-red-500 transition-all duration-150 cursor-pointer"
              >
                {statusKey === "canceled" || statusKey === "cancelled"
                  ? "Remove"
                  : "Cancel Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FILTER_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "canceled",
] as const;

const Bookings = () => {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: bookingsResponse } = useFetchAllBookings();
  const bookings = bookingsResponse?.data ?? [];

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => normalizeStatus(b.status) === "pending")
      .length,
    confirmed: bookings.filter((b) => normalizeStatus(b.status) === "confirmed")
      .length,
    completed: bookings.filter((b) => normalizeStatus(b.status) === "completed")
      .length,
    canceled: bookings.filter((b) =>
      ["canceled", "cancelled"].includes(normalizeStatus(b.status)),
    ).length,
  };

  const filtered = bookings.filter((b) => {
    const name = `${b.first_name} ${b.last_name}`.toLowerCase();
    const matchesSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      b.service.service_name.toLowerCase().includes(search.toLowerCase()) ||
      b.email_address.toLowerCase().includes(search.toLowerCase());

    const bStatus = normalizeStatus(b.status);
    const matchesFilter =
      filterStatus === "all" ||
      bStatus === filterStatus ||
      (filterStatus === "canceled" && bStatus === "cancelled");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative overflow-y-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Bookings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage and track all service appointments
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard variant="total" value={stats.total} />
        <StatCard variant="pending" value={stats.pending} />
        <StatCard variant="confirmed" value={stats.confirmed} />
        <StatCard variant="completed" value={stats.completed} />
      </div>

      {/* Table container */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search bookings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[13px] bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-zinc-400 transition-all"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {FILTER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg capitalize transition-all duration-150 ${
                  filterStatus === s
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                {[
                  "Customer",
                  "Service & Staff",
                  "Date & Time",
                  "Status",
                  "Payment",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-[13px] text-zinc-400"
                  >
                    Loading bookings…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-[13px] text-zinc-400"
                  >
                    No bookings match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelected(row)}
                    className="group hover:bg-indigo-50/40 cursor-pointer transition-colors duration-100"
                  >
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600 shrink-0">
                          {getInitials(row.first_name, row.last_name)}
                        </div>
                        <span className="text-[13px] font-medium text-zinc-900">
                          {row.first_name} {row.last_name}
                        </span>
                      </div>
                    </td>

                    {/* Service & Staff */}
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-zinc-900">
                        {row.service.service_name}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        with {row.staff.first_name} {row.staff.last_name}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-zinc-700">
                        {formatDate(row.booking_date)}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {convertTo12Hours(row.start_time)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-zinc-700 capitalize">
                        {row.payment_method.toLowerCase()}
                      </p>
                      <p className="text-[11px] font-semibold text-red-400 mt-0.5">
                        ₱
                        {parseFloat(row.service_price).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        · Unpaid
                      </p>
                    </td>

                    {/* Arrow */}
                    <td className="px-4 py-3.5">
                      <ChevronRight
                        size={14}
                        className="text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-[12px] text-zinc-400">
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <SidePanel
          selected={selected}
          onClose={() => setSelected(null)}
          setSelected={setSelected}
        />
      )}
    </div>
  );
};

export default Bookings;
