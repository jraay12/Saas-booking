import { useState } from "react";
import Button from "../../component/Button";
import { Edit, Filter, Trash, UserPlus } from "lucide-react";
import { staffs as mockStaffs } from "../../data/mockdata";

/* =========================
   MAIN PAGE
========================= */
const Staff = () => {
  const [filterRole, setFilterRole] = useState("All");

  // ✅ FILTER LOGIC
  const filteredStaff =
    filterRole === "All"
      ? mockStaffs
      : mockStaffs.filter((s) => s.role === filterRole);

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Staff Management</h1>
          <p className="text-sm text-black/50">
            Manage your team members and their availability
          </p>
        </div>

        <Button name="Add Staff" icon={UserPlus} className="w-40 max-h-10" />
      </div>

      {/* FILTER */}
      <FilterSection
        onSelect={setFilterRole}
        selectedRole={filterRole}
        total={filteredStaff.length}
      />

      {/* GRID (auto responsive max fit) */}

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {filteredStaff.map((item) => (
          <StaffCards key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Staff;

/* =========================
   FILTER SECTION
========================= */
type FilterSectionProps = {
  onSelect: (value: string) => void;
  selectedRole: string;
  total: number;
};

function FilterSection({ onSelect, selectedRole, total }: FilterSectionProps) {
  const roles = [
    "All",
    "Senior Barber",
    "Barber",
    "Hair Stylist",
    "Senior Stylist",
  ];

  return (
    <div className="flex flex-wrap gap-3 w-full min-h-16 border bg-[#f5f2ff] rounded-2xl border-gray-200 items-center px-4 py-3 mb-10">
      <Filter className="text-black/50 w-4 h-4" />

      <h1 className="text-sm font-medium text-black">Filter by Role:</h1>

      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const isSelected = selectedRole === role;

          return (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className={`
                px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer border
                ${
                  isSelected
                    ? "bg-[#3525cc] text-white font-medium border-[#3525cc]"
                    : "bg-[#f1edfa] border-gray-300 text-black/70 hover:border-[#3525cc] hover:text-[#3525cc]"
                }
              `}
            >
              {role}
            </button>
          );
        })}
      </div>

      <div className="grow text-black text-xs font-medium text-end">
        Displaying {total} results
      </div>
    </div>
  );
}

/* =========================
   STAFF CARD
========================= */
type Staff = {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  description?: string;
};

type StaffCardsProps = {
  data: Staff;
};

function StaffCards({ data }: StaffCardsProps) {
  return (
    <div className="border min-h-70 md:max-w-60 bg-[#fcf7ff] rounded-2xl border-gray-300 p-4 flex flex-col">
      {/* TOP SECTION */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Avatar */}
        <div className="border w-max rounded-full p-1 border-gray-300">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-black/60 ">
            {data.avatar ? (
              <img src={data.avatar} className="w-full h-full object-cover" />
            ) : (
              <span>{data.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Name + Role + Description */}
        <div className="leading-4">
          <h1 className="font-medium text-black">{data.name}</h1>

          <p className="text-xs text-[#3525cc] font-medium">{data.role}</p>

          <p className="mt-4 text-xs text-black/50 min-h-[40px]">
            {data.description?.trim() ? data.description : "No description"}
          </p>
        </div>
      </div>

      {/* BUTTON (always bottom aligned) */}
      <div className="mt-4 flex justify-between gap-4">
        <Button name="Edit" className="w-full h-8" icon={Edit} variant="edit"/>
        <Button name="Delete" className="w-full h-8 " icon={Trash} variant="danger" />
      </div>
    </div>
  );
}
