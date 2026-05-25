import { useNavigate, useLocation } from "react-router";

type Props = {
  data: any;
  slug: string;
};

const menus = [
  {
    label: "Find Service",
    value: "service",
    path: "/service",
  },
  {
    label: "Staff",
    value: "staff",
    path: "/staff",
  },
];

const PublicHeader = ({ data, slug }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (menu: any) => {
    navigate(`${menu.path}/${slug}`);
  };

  // 👇 derive active menu from URL
  const getActiveMenu = () => {
    if (location.pathname.includes("/service")) return "service";
    if (location.pathname.includes("/staff")) return "staff";
    if (location.pathname.includes("/location")) return "location";
    return "service";
  };

  const activeMenu = getActiveMenu();

  return (
    <div className="px-4 w-full h-20 border-b border-gray-300 flex items-center justify-between bg-white">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <img />
        <h1 className="text-2xl font-bold text-[#3525cc]">Bookify</h1>
      </div>

      {location.pathname !== "/register" && (
        <div className="hidden md:flex gap-10">
          {menus.map((menu) => (
            <div
              key={menu.value}
              className={`text-md cursor-pointer font-medium transition-all duration-300 relative
          ${activeMenu === menu.value ? "text-[#3525cc]" : "text-black/60"}`}
              onClick={() => handleClick(menu)}
            >
              {menu.label}

              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-[#3525cc] rounded-full transition-all duration-300
            ${activeMenu === menu.value ? "w-full" : "w-0"}`}
              />
            </div>
          ))}
        </div>
      )}
      {/* RIGHT MENU */}
    </div>
  );
};

export default PublicHeader;
