import { Outlet } from "react-router";
import Sidebar from "../component/Sidebar";

import {
  LayoutDashboard,
  CalendarDays,
  Settings,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    path: "/staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings",
    path: "/staff/bookings",
    icon: CalendarDays,
  },
  {
    label: "Settings",
    path: "/staff/settings",
    icon: Settings,
  },
];

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5fa] grid grid-cols-1 md:grid-cols-[260px_1fr] ">
      {/* SIDEBAR */}
      <aside className="hidden md:block bg-white border-r border-gray-200 h-screen sticky top-0">
        <Sidebar data={menu} />
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex flex-col min-h-screen ">
        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
