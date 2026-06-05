import {
  CalendarDays,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Circle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface RecentBooking {
  id: string;
  first_name: string;
  last_name: string;
  service: { service_name: string };
  staff: { first_name: string; last_name: string };
  booking_date: string;
  start_time: string;
  status: BookingStatus;
  service_price: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  duration: string;
  client: string;
  service: string;
  staff: string;
  status: BookingStatus;
}

// ─── Mock / placeholder data — swap with real hooks ──────────────────────────

const TODAY_SCHEDULE: ScheduleItem[] = [
  {
    id: "1",
    time: "09:00",
    duration: "60 min",
    client: "Sofia Reyes",
    service: "Swedish Relaxation",
    staff: "Maria Santos",
    status: "CONFIRMED",
  },
  {
    id: "2",
    time: "10:30",
    duration: "90 min",
    client: "Marco Tan",
    service: "Deep Tissue Massage",
    staff: "Juan dela Cruz",
    status: "CONFIRMED",
  },
  {
    id: "3",
    time: "13:00",
    duration: "60 min",
    client: "Camille Lim",
    service: "Foot Reflexology",
    staff: "Ana Bautista",
    status: "PENDING",
  },
  {
    id: "4",
    time: "14:30",
    duration: "45 min",
    client: "Diego Villanueva",
    service: "Aromatherapy",
    staff: "Maria Santos",
    status: "CONFIRMED",
  },
  {
    id: "5",
    time: "16:00",
    duration: "60 min",
    client: "Isabel Cruz",
    service: "Sports Massage",
    staff: "Juan dela Cruz",
    status: "PENDING",
  },
];

const RECENT_BOOKINGS: RecentBooking[] = [
  {
    id: "bk-001",
    first_name: "Alex",
    last_name: "Johnson",
    service: { service_name: "Hot Stone Therapy" },
    staff: { first_name: "Ana", last_name: "Bautista" },
    booking_date: "2025-06-14",
    start_time: "10:00",
    status: "COMPLETED",
    service_price: "1500",
  },
  {
    id: "bk-002",
    first_name: "Sofia",
    last_name: "Reyes",
    service: { service_name: "Swedish Relaxation" },
    staff: { first_name: "Maria", last_name: "Santos" },
    booking_date: "2025-06-13",
    start_time: "13:30",
    status: "CONFIRMED",
    service_price: "900",
  },
  {
    id: "bk-003",
    first_name: "Marco",
    last_name: "Tan",
    service: { service_name: "Deep Tissue Massage" },
    staff: { first_name: "Juan", last_name: "dela Cruz" },
    booking_date: "2025-06-13",
    start_time: "09:00",
    status: "PENDING",
    service_price: "1200",
  },
  {
    id: "bk-004",
    first_name: "Camille",
    last_name: "Lim",
    service: { service_name: "Foot Reflexology" },
    staff: { first_name: "Ana", last_name: "Bautista" },
    booking_date: "2025-06-12",
    start_time: "15:00",
    status: "CANCELLED",
    service_price: "750",
  },
  {
    id: "bk-005",
    first_name: "Diego",
    last_name: "Villanueva",
    service: { service_name: "Aromatherapy Massage" },
    staff: { first_name: "Maria", last_name: "Santos" },
    booking_date: "2025-06-12",
    start_time: "11:00",
    status: "COMPLETED",
    service_price: "1100",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function convertTo12Hours(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function getTodayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayFormatted() {
  return new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Status configs ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-blue-500",
    badge: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 border-red-200",
    text: "text-red-600",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  trend?: string;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  iconBg,
  trend,
}: StatCardProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accent}`}
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

// ─── Timeline dot ─────────────────────────────────────────────────────────────

function TimelineDot({ status }: { status: BookingStatus }) {
  const colors: Record<BookingStatus, string> = {
    CONFIRMED: "bg-blue-500 ring-blue-100",
    PENDING: "bg-amber-400 ring-amber-100",
    COMPLETED: "bg-emerald-500 ring-emerald-100",
    CANCELLED: "bg-red-400 ring-red-100",
  };
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full ring-4 shrink-0 mt-1 ${colors[status]}`}
    />
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const confirmedToday = TODAY_SCHEDULE.filter(
    (s) => s.status === "CONFIRMED",
  ).length;
  const pendingToday = TODAY_SCHEDULE.filter(
    (s) => s.status === "PENDING",
  ).length;

  const totalRevenue = RECENT_BOOKINGS.filter(
    (b) => b.status === "COMPLETED",
  ).reduce((sum, b) => sum + parseFloat(b.service_price), 0);

  return (
    <div className="relative">
      {/* ── Hero header ── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-indigo-500" strokeWidth={2} />
            <span className="text-[12px] font-semibold text-indigo-500 uppercase tracking-widest">
              {getTodayGreeting()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Here's what's happening today
          </h1>
          <p className="text-sm text-zinc-400 mt-1">{getTodayFormatted()}</p>
        </div>

        {/* Quick today pill */}
        <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2.5">
          <CalendarDays size={15} className="text-indigo-500" strokeWidth={2} />
          <div>
            <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Today
            </p>
            <p className="text-[13px] font-semibold text-indigo-900">
              {TODAY_SCHEDULE.length} appointments
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bookings"
          value={TODAY_SCHEDULE.length}
          sub="Scheduled today"
          accent="from-indigo-500 to-violet-600"
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
          label="Confirmed"
          value={confirmedToday}
          sub="Ready to go"
          accent="from-blue-500 to-cyan-500"
          iconBg="bg-blue-50"
          icon={
            <CheckCircle2
              size={18}
              className="text-blue-600"
              strokeWidth={1.75}
            />
          }
        />
        <StatCard
          label="Pending"
          value={pendingToday}
          sub="Awaiting confirmation"
          accent="from-amber-400 to-orange-500"
          iconBg="bg-amber-50"
          icon={
            <Clock size={18} className="text-amber-600" strokeWidth={1.75} />
          }
        />
        <StatCard
          label="Revenue"
          value={`₱${totalRevenue.toLocaleString("en-PH")}`}
          sub="From completed bookings"
          accent="from-emerald-500 to-teal-500"
          iconBg="bg-emerald-50"
          icon={
            <TrendingUp
              size={18}
              className="text-emerald-600"
              strokeWidth={1.75}
            />
          }
          trend="+8%"
        />
      </div>
 
    </div>
  );
};

export default Dashboard;
