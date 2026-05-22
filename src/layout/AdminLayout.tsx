import { Outlet } from "react-router";
import Sidebar from "../component/Sidebar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  CalendarDays,
  Settings,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Staff",
    path: "/admin/staff",
    icon: Users,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f2f5f7] grid grid-cols-1 md:grid-cols-[260px_1fr]">
      {/* SIDEBAR */}
      <aside className="bg-white border-r border-gray-200">
        <Sidebar data={menu} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
