import { Outlet } from "react-router";
import PublicHeader from "../component/PublicHeader";
import { services, staffs, timeSlots } from "../data/mockdata";
import { useLocation, useParams } from "react-router";
import { useGetBusinessDetailsBySlug } from "../features/business/business.hook";
import NotFound from "../pages/public/NotFoundPage";

function BookingPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
      {/* HERO SKELETON */}
      <div className="mt-6 h-72 sm:h-96 w-full rounded-2xl bg-gray-300" />

      {/* GRID */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-10 sm:mt-20">
        {/* LEFT SIDE */}
        <div className="p-4 space-y-6">
          {/* categories */}
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-300 rounded" />
            ))}
          </div>

          {/* search */}
          <div className="h-10 w-full bg-gray-300 rounded-lg" />

          {/* service cards */}
          <div className="space-y-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full bg-gray-300 rounded-lg"
              />
            ))}
          </div>

          {/* pagination */}
          <div className="flex justify-end gap-2 mt-8">
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-8 w-8 bg-gray-300 rounded" />
            <div className="h-8 w-8 bg-gray-300 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
          </div>
        </div>

        {/* RIGHT SIDE (APPOINTMENT CARD) */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-6">
          {/* title */}
          <div className="h-5 w-40 bg-gray-300 rounded" />

          {/* staff */}
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div className="w-12 h-3 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* date */}
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded" />
              ))}
            </div>
          </div>

          {/* time */}
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-300 rounded" />
              ))}
            </div>
          </div>

          {/* summary button */}
          <div className="space-y-2 pt-4 border-t">
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicLayout() {
  const location = useLocation();
  const { slug } = useParams();

  const { data: business, isLoading } = useGetBusinessDetailsBySlug(slug!);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  // ❌ NotFound only when not loading and not auth route
  if (!business && !isLoading && !isAuthRoute) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f5f7]">
      {location.pathname !== "/login" && business && (
        <PublicHeader data={business} slug={slug ?? ""} />
      )}

      <main className="flex-1">
        {isLoading && !isAuthRoute ? (
          <BookingPageSkeleton />
        ) : (
          <Outlet context={{ business, services, staffs, timeSlots }} />
        )}
      </main>
    </div>
  );
}