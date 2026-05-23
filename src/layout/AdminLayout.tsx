import { Outlet } from "react-router";
import Sidebar from "../component/Sidebar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  CalendarDays,
  Settings,
} from "lucide-react";

import AdminHeader from "../component/AdminHeader";

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
    <div className="min-h-screen bg-[#f5f5fa] grid grid-cols-1 md:grid-cols-[260px_1fr] ">
      {/* SIDEBAR */}
      <aside className="hidden md:block bg-white border-r border-gray-200 h-screen sticky top-0">
        <Sidebar data={menu} />
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex flex-col min-h-screen ">
        {/* HEADER */}
        {/* <AdminHeader /> */}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}