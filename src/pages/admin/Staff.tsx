import { useState } from "react";
import {
  Edit,
  LayoutGrid,
  Table,
  Trash,
  UserPlus,
  Calendar,
} from "lucide-react";
import Button from "../../component/Button";
import CreateStaffModal from "../../component/CreateStaffModal";
import DeleteModal from "../../component/DeleteModal";
import { useGetStaffMembers } from "../../features/staff/staff.hook";
import { getBusinessId } from "../../lib/decoder";

/* =========================
   TYPES
========================= */
type StaffUser = {
  id: string;
  avatar: string | null;
  email: string;
  first_name: string;
  last_name: string;
};

type StaffMember = {
  id: string;
  user_id: string;
  business_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  user: StaffUser;
};

/* =========================
   HELPERS
========================= */
const AV_COLORS = [
  { bg: "bg-[#EEEDFE]", text: "text-[#3C3489]" },
  { bg: "bg-[#E1F5EE]", text: "text-[#085041]" },
  { bg: "bg-[#FAECE7]", text: "text-[#712B13]" },
  { bg: "bg-[#E6F1FB]", text: "text-[#0C447C]" },
  { bg: "bg-[#FBEAF0]", text: "text-[#72243E]" },
  { bg: "bg-[#FAEEDA]", text: "text-[#633806]" },
];

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/* =========================
   AVATAR COMPONENT
========================= */
type AvatarProps = {
  user: StaffUser;
  index: number;
  size?: "md" | "sm";
};

function Avatar({ user, index, size = "md" }: AvatarProps) {
  const color = AV_COLORS[index % AV_COLORS.length];
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
  return (
    <div
      className={`${sizeClass} ${color.bg} ${color.text} rounded-full flex items-center justify-center font-medium flex-shrink-0 overflow-hidden`}
    >
      {user.avatar ? (
        <img
          src={`${import.meta.env.VITE_IMAGE_PREFIX}${user.avatar}`}
          alt={user.first_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            e.currentTarget.parentElement!.innerText = getInitials(
              user.first_name,
              user.last_name,
            );
          }}
        />
      ) : (
        getInitials(user.first_name, user.last_name)
      )}
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
type ViewMode = "card" | "table";

const Staff = () => {
  const [view, setView] = useState<ViewMode>("card");
  const [createStaffModal, setCreateStaffModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const { data: response } = useGetStaffMembers();
  const businessId = getBusinessId()

  const staffs: StaffMember[] = response ?? [];

  // Stats derived from real data
  const totalStaff = staffs.length;
  const distinctRoles = new Set(staffs.map((s) => s.role)).size;
  const latestJoin =
    staffs.length > 0
      ? formatDate(
          staffs.reduce((a, b) =>
            new Date(a.created_at) > new Date(b.created_at) ? a : b,
          ).created_at,
        )
      : "—";

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-medium text-black">
            Staff management
          </h1>
          <p className="text-sm text-black/50 mt-1">
            Manage your team members and their availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("card")}
              className={`p-2 transition-colors cursor-pointer ${
                view === "card"
                  ? "bg-gray-100 text-black"
                  : "bg-white text-black/40 hover:bg-gray-50"
              }`}
              aria-label="Card view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2 transition-colors cursor-pointer ${
                view === "table"
                  ? "bg-gray-100 text-black"
                  : "bg-white text-black/40 hover:bg-gray-50"
              }`}
              aria-label="Table view"
            >
              <Table size={16} />
            </button>
          </div>

          <Button
            name="Add Staff"
            icon={UserPlus}
            className="h-9 px-4"
            onClick={() => setCreateStaffModal(true)}
          />
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        <StatCard label="Total staff" value={totalStaff} sub="Team members" />
        <StatCard label="Roles" value={distinctRoles} sub="Distinct roles" />
        <StatCard
          label="Latest join"
          value={latestJoin}
          sub="Most recent hire"
          smallValue
        />
      </div>

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {staffs.length === 0 && (
            <p className="text-sm text-black/40 col-span-full text-center py-12">
              No staff members yet.
            </p>
          )}
          {staffs.map((s, i) => (
            <StaffCard
              key={s.id}
              staff={s}
              index={i}
              onDelete={() => {
                setSelectedStaff(s);
                setDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <StaffTable
          staffs={staffs}
          onDelete={(s) => {
            setSelectedStaff(s);
            setDeleteModal(true);
          }}
        />
      )}

      <CreateStaffModal
        onClose={() => setCreateStaffModal(false)}
        open={createStaffModal}
      />
      <DeleteModal
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
        staff={selectedStaff}
      />
    </div>
  );
};

export default Staff;

/* =========================
   STAT CARD
========================= */
type StatCardProps = {
  label: string;
  value: string | number;
  sub: string;
  smallValue?: boolean;
};

function StatCard({ label, value, sub, smallValue = false }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3.5">
      <p className="text-[11px] uppercase tracking-widest text-black/40 font-medium mb-1.5">
        {label}
      </p>
      <p
        className={`font-medium text-black ${smallValue ? "text-[15px] pt-1" : "text-[22px]"}`}
      >
        {value}
      </p>
      <p className="text-[11px] text-black/40 mt-0.5">{sub}</p>
    </div>
  );
}

/* =========================
   STAFF CARD
========================= */
type StaffCardProps = {
  staff: StaffMember;
  index: number;
  onDelete: () => void;
};

function StaffCard({ staff, index, onDelete }: StaffCardProps) {
  const { user } = staff;

  return (
    <div className="border border-gray-200 bg-white rounded-2xl p-4 flex flex-col gap-3 hover:-translate-y-0.5 hover:border-gray-300 transition-all duration-150">
      <Avatar user={user} index={index} size="md" />

      <div className="flex-1">
        <p className="font-medium text-black text-sm">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-xs text-black/50 mt-0.5 truncate">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-black/40">
          <Calendar size={11} />
          <span>Joined {formatDate(staff.created_at)}</span>
        </div>
      </div>

      <span className="w-max text-[11px] px-2.5 py-1 rounded-full font-medium bg-[#EEEDFE] text-[#3C3489]">
        {roleLabel(staff.role)}
      </span>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <Button
          name="Edit"
          icon={Edit}
          variant="edit"
          className="flex-1 h-8 text-xs"
        />
        <Button
          name="Delete"
          icon={Trash}
          variant="danger"
          className="flex-1 h-8 text-xs"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

/* =========================
   STAFF TABLE
========================= */
type StaffTableProps = {
  staffs: StaffMember[];
  onDelete: (s: StaffMember) => void;
};

function StaffTable({ staffs, onDelete }: StaffTableProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-black/40 uppercase text-[11px] tracking-widest">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Staff member</th>
            <th className="text-left px-4 py-3 font-medium">Role</th>
            <th className="text-left px-4 py-3 font-medium">Joined</th>
            <th className="text-right px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffs.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-12 text-sm text-black/40"
              >
                No staff members yet.
              </td>
            </tr>
          )}
          {staffs.map((s, i) => (
            <tr
              key={s.id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Person cell */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar user={s.user} index={i} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-black text-[13px] truncate">
                      {s.user.first_name} {s.user.last_name}
                    </p>
                    <p className="text-[11px] text-black/40 truncate">
                      {s.user.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-4 py-3">
                <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-[#EEEDFE] text-[#3C3489]">
                  {roleLabel(s.role)}
                </span>
              </td>

              {/* Joined */}
              <td className="px-4 py-3 text-[13px] text-black/50">
                {formatDate(s.created_at)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="p-1.5 rounded-lg border border-transparent hover:bg-gray-100 hover:border-gray-200 text-black/40 hover:text-black transition-all cursor-pointer"
                    aria-label={`Edit ${s.user.first_name}`}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="p-1.5 rounded-lg border border-transparent hover:bg-red-50 hover:border-red-200 text-black/40 hover:text-red-600 transition-all cursor-pointer"
                    aria-label={`Delete ${s.user.first_name}`}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
