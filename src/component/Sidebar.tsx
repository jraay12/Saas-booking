import { Calendar } from "lucide-react";
import { NavLink } from "react-router";

type Props = {
  data: any[];
};

const Sidebar = ({ data }: Props) => {
  return (
    <div className="h-screen w-full bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* LOGO */}
      <div className="flex items-center gap-2 text-2xl text-[#3525cc] font-bold pb-6 border-b border-gray-100">
        <Calendar className="w-7 h-7" />
        <h1>Bookify</h1>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2 mt-6">
        {data &&
          data.map((item: any) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-[#edeaff] text-[#3525cc] font-medium"
                    : "text-black/60 hover:bg-gray-100"
                }
              `
              }
            >
              {/* ICON */}
              {item.icon && (
                <item.icon className="w-5 h-5" />
              )}

              {/* LABEL */}
              <p>{item.label}</p>
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;