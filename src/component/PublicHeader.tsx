import { useState } from "react";

type props = {
  data: any;
};

const menus = [
  {
    label: "Find Service",
    value: "service",
  },
  {
    label: "Staff",
    value: "staff",
  },
  {
    label: "About",
    value: "about",
  },
  {
    label: "Location",
    value: "location",
  },
];

const PublicHeader = (props: props) => {
  const [activeMenu, setActiveMenu] = useState("service");

  return (
    <div className="px-4 w-full h-20 border-b border-gray-300 flex items-center justify-between ">
      <div className="flex items-center gap-2">
        <img />
        <h1 className="text-2xl font-bold text-[#3525cc]">{props.data.name}</h1>
      </div>
      <div>
        <p className="flex gap-10">
          {menus &&
            menus.map((menu) => (
              <div
                key={menu.value}
                className={`text-md cursor-pointer font-medium transition-all duration-300 ease-in-out relative
          ${activeMenu === menu.value ? "text-[#3525cc]" : "text-black/60"}`}
                onClick={() => setActiveMenu(menu.value)}
              >
                {menu.label}

                {/* rounded underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-[#3525cc] rounded-full transition-all duration-300 ease-in-out
            ${activeMenu === menu.value ? "w-full" : "w-0"}
          `}
                />
              </div>
            ))}
        </p>
      </div>
    </div>
  );
};

export default PublicHeader;
