import { Calendar, User, LogOut, ChevronUp } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";

type Props = {
  data: any[];
};

const Sidebar = ({ data }: Props) => {
  // React Router
  const navigate = useNavigate();

  const { user: profile, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Functions
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
                    ? "bg-[#edeaff] text-[#3525cc] font-medium border-r-5"
                    : "text-black/60 hover:bg-gray-100"
                }
              `
              }
            >
              {/* ICON */}
              {item.icon && <item.icon className="w-5 h-5" />}

              {/* LABEL */}
              <p>{item.label}</p>
            </NavLink>
          ))}
      </div>
      <div className="grow " />
      <div className="relative border-t border-gray-300">
        {/* Popover */}
        {open && (
          <div
            ref={popoverRef}
            className="absolute bottom-[calc(100%+8px)] left-2 right-2 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50
                 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="h-px bg-zinc-100 mx-3" />

            {/* Menu items */}
            <div className="p-1.5">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-zinc-50 transition-colors group cursor-pointer">
                <User
                  size={15}
                  className="text-zinc-400 group-hover:text-indigo-500 transition-colors"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-[13px] font-medium text-zinc-700">
                    View profile
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Manage your account
                  </p>
                </div>
              </button>
            </div>

            <div className="h-px bg-zinc-100 mx-3" />

            <div className="p-1.5">
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-red-50 transition-colors group cursor-pointer"
              >
                <LogOut
                  size={15}
                  className="text-red-300 group-hover:text-red-500 transition-colors"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-[13px] font-medium text-red-400 group-hover:text-red-500">
                    Log out
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Sign out of your account
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Profile trigger row */}
        <div
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
          <img
            src={
              profile?.avatar?.startsWith("https")
                ? profile.avatar
                : `${import.meta.env.VITE_AVATAR_PREFIX}${profile?.avatar}`
            }
            className="w-9 h-9 rounded-full ring-1 ring-zinc-200 shrink-0 object-cover"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="font-medium text-[13px] text-zinc-900 truncate">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <p className="text-[11px] text-zinc-400 truncate">
              {profile?.email}
            </p>
          </div>
          <ChevronUp
            size={14}
            strokeWidth={2.5}
            className={`text-zinc-300 shrink-0 transition-transform duration-200 ${open ? "rotate-0" : "rotate-180"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
