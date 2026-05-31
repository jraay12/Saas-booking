import { Outlet } from "react-router";
import PublicHeader from "../component/PublicHeader";
import { services, staffs, timeSlots } from "../data/mockdata";
import { useLocation, useParams } from "react-router";
import { useGetBusinessDetailsBySlug } from "../features/business/business.hook";
import NotFound from "../pages/public/NotFoundPage";
export default function PublicLayout() {
  const location = useLocation();
  const { slug } = useParams();

  const { data: business, isLoading } = useGetBusinessDetailsBySlug(slug!);

  // if (!business && !isLoading) return <NotFound />;
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
