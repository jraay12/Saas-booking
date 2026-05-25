import { Outlet } from "react-router";
import PublicHeader from "../component/PublicHeader";
import { business, services, staffs, timeSlots } from "../data/mockdata";
import { useLocation } from "react-router";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f5f7]">
      {location.pathname !== "/login" && (
        <PublicHeader data={business} slug="123" />
      )}

      <main className="flex-1 ">
        <Outlet context={{ business, services, staffs, timeSlots }} />
      </main>
    </div>
  );
}
