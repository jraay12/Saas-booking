import { useEffect, useMemo, useRef, useState } from "react";
import {
  Banknote,
  Clock,
  ImageIcon,
  MoreVertical,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Button from "../../component/Button";
import CreateServiceModal from "../../component/CreateServiceModal";
import {
  useGetAllServices,
  useToggleStatus,
  useUpdateService,
} from "../../features/service/service.hook";
import type {
  ServiceFormType,
  Service as ServiceType,
} from "../../types/types";

/* =========================
   MAIN PAGE
========================= */

const Service = () => {
  const { data: services = [] } = useGetAllServices();
  const toggleMutation = useToggleStatus();
  const updateServiceMutation = useUpdateService();

  const [createServiceModal, setCreateServiceModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [staffDrawerOpen, setStaffDrawerOpen] = useState(false);

  const categories = useMemo<string[]>(() => {
    return [
      "All",
      ...Array.from(
        new Set<string>(services.map((item: ServiceType) => item.category)),
      ),
    ];
  }, [services]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [serviceList, setServiceList] = useState<ServiceType[]>([]);

  useEffect(() => {
    setServiceList(services);
  }, [services]);

  const filteredServices =
    selectedCategory === "All"
      ? serviceList
      : serviceList.filter((item) => item.category === selectedCategory);

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleSaveEdit = (updated: ServiceFormType) => {
    const formData = new FormData();

    formData.append("service_name", updated.service_name ?? "");
    formData.append("category", updated.category ?? "");
    formData.append("description", updated.description ?? "");
    formData.append("price", String(updated.price ?? 0));
    formData.append("hour", String(updated.hour ?? 0));
    formData.append("minute", String(updated.minute ?? 0));

    // THIS IS THE IMPORTANT PART
    if (updated.cover_image instanceof File) {
      formData.append("image", updated.cover_image);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    updateServiceMutation.mutate(
      {
        data: formData,
        id: updated.id,
      },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedService(null);
        },
      },
    );
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Service Management</h1>
          <p className="text-sm text-black/50 mt-2 max-w-3/4">
            Configure and manage the service offerings available for booking,
            organize them by category, and assign staff members.
          </p>
        </div>
        <Button
          icon={Plus}
          name="Add Service"
          className="max-h-10 max-w-max text-sm"
          onClick={() => setCreateServiceModal(true)}
        />
      </div>

      {/* FILTER */}
      <FilterSection
        service={categories}
        selectedService={selectedCategory}
        onClick={setSelectedCategory}
      />

      <div className="mb-10" />

      {/* GRID */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {filteredServices.map((item) => (
          <ServiceCard
            key={item.id}
            data={item}
            onToggle={() => handleToggle(item.id)}
            isMenuOpen={activeMenuId === item.id}
            onOpenMenu={() =>
              setActiveMenuId(activeMenuId === item.id ? null : item.id)
            }
            onCloseMenu={() => setActiveMenuId(null)}
            onEdit={() => {
              setSelectedService(item);
              setEditModalOpen(true);
              setActiveMenuId(null);
            }}
            onManageStaff={() => {
              setSelectedService(item);
              setStaffDrawerOpen(true);
              setActiveMenuId(null);
            }}
          />
        ))}
      </div>

      <CreateServiceModal
        onClose={() => setCreateServiceModal(false)}
        open={createServiceModal}
      />

      {/* EDIT SERVICE MODAL */}
      {editModalOpen && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedService(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* MANAGE STAFF SIDE PANEL */}
      {staffDrawerOpen && selectedService && (
        <ManageStaffPanel
          service={selectedService}
          onClose={() => {
            setStaffDrawerOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default Service;

/* =========================
   FILTER SECTION
========================= */

type FilterSectionProps = {
  service: string[];
  selectedService: string;
  onClick: (value: string) => void;
};

function FilterSection({
  onClick,
  selectedService,
  service,
}: FilterSectionProps) {
  return (
    <div className="flex flex-wrap gap-2 border border-gray-300 bg-[#eae6f5] min-h-10 rounded-md p-2">
      {service.map((item) => {
        const isSelected = selectedService === item;
        return (
          <button
            key={item}
            onClick={() => onClick(item)}
            className={`
              text-xs py-1 px-4 rounded-md font-medium transition cursor-pointer
              ${isSelected ? "bg-white text-[#3525cc]" : "text-black/60 hover:bg-white/50"}
            `}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

/* =========================
   SERVICE CARD
========================= */

type ServiceCardProps = {
  data: ServiceType;
  onToggle: () => void;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onEdit: () => void;
  onManageStaff: () => void;
};

function ServiceCard({
  data,
  onToggle,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  onEdit,
  onManageStaff,
}: ServiceCardProps) {
  return (
    <div
      className={`
        border min-h-70 md:max-w-80 rounded-2xl p-4 flex flex-col shadow transition-all duration-300 relative
        ${data.is_active ? "bg-white border-gray-300" : "bg-white border-gray-200 opacity-70"}
      `}
    >
      {/* TOP */}
      <div className="flex justify-between items-center relative">
        <h1
          className={`
            px-2 text-xs py-1 font-medium rounded-md
            ${data.is_active ? "bg-[#eae6f5]" : "bg-gray-100 text-black/60"}
          `}
        >
          {data.category}
        </h1>

        <div className="flex items-center gap-2 relative">
          {/* TOGGLE */}
          <button
            onClick={onToggle}
            className={`
              relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer
              ${data.is_active ? "bg-[#3525cc]" : "bg-gray-300"}
            `}
          >
            <div
              className={`
                absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300
                ${data.is_active ? "translate-x-5" : "translate-x-0.5"}
              `}
            />
          </button>

          {/* 3 DOT MENU */}
          <button
            onClick={isMenuOpen ? onCloseMenu : onOpenMenu}
            className="p-1 rounded-md hover:bg-black/5"
          >
            <MoreVertical className="w-4 h-4 text-black/60" />
          </button>

          {/* DROPDOWN */}
          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 shadow-lg rounded-lg text-xs z-50">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={onEdit}
              >
                Edit Service
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={onManageStaff}
              >
                Manage Staff
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-4 min-h-[64px] flex items-start">
        <h1
          className={`
      text-2xl max-w-3/4 font-medium transition-all leading-tight
      ${data.is_active ? "text-black" : "text-black/60"}
    `}
        >
          {data.service_name}
        </h1>
      </div>

      {/* DESCRIPTION */}
      <p
        className={`
          mt-4 text-xs text-justify transition-all flex-1
          ${data.is_active ? "text-black/50" : "text-black/40"}
        `}
      >
        {data.description}
      </p>

      {/* DETAILS */}
      <div className="flex mt-4 gap-10 shrink-0">
        <div className="flex items-center gap-2 text-black/60">
          <Clock className="w-4 h-4" />
          <p className="text-xs font-medium">
            {data.hour > 0 && `${data.hour} hr `}
            {data.minute} mins
          </p>
        </div>
        <div className="flex items-center gap-2 text-black/60">
          <Banknote className="w-4 h-4" />
          <p className="text-xs font-medium">₱{data.price}</p>
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-4">
        <span
          className={`
            text-[10px] px-2 py-1 rounded-full font-medium
            ${data.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
          `}
        >
          {data.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="border border-gray-300 mt-6" />

      {/* ASSIGNED STAFF */}
      <div className="flex mt-4">
        <h1 className="uppercase text-xs font-medium text-black/60">
          Assigned Staff
        </h1>
      </div>
    </div>
  );
}

/* =========================
   EDIT SERVICE MODAL
========================= */

type EditServiceModalProps = {
  service: ServiceType;
  onClose: () => void;
  onSave: (updated: ServiceFormType) => void;
};

function EditServiceModal({ service, onClose, onSave }: EditServiceModalProps) {
  const [form, setForm] = useState<ServiceFormType>({
    ...service,
    cover_image: null,
  });
  const [visible, setVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    service.image_path ?? null, // adjust to your actual field name
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "hour" || name === "minute" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  // ── IMAGE HANDLING ──────────────────────────────────────

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    setForm((prev) => ({
      ...prev,
      cover_image: file,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveImage = () => {
    setPreviewUrl(null);

    setForm((prev) => ({
      ...prev,
      cover_image: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 transition-opacity duration-250"
        style={{ background: "rgba(0,0,0,0.4)", opacity: visible ? 1 : 0 }}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-250"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(12px)",
          }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold">Edit Service</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-gray-100 text-black/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {/* ── COVER IMAGE ── */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-black/60">
                Cover Image
              </label>

              {previewUrl ? (
                /* IMAGE PREVIEW */
                <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-gray-200">
                  <img
                    src={
                      previewUrl.startsWith("blob:")
                        ? previewUrl
                        : `${import.meta.env.VITE_IMAGE_PREFIX}${previewUrl}`
                    }
                    alt="Service cover"
                    className="w-full h-full object-cover"
                  />

                  {/* HOVER ACTIONS */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 bg-white text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* DROPZONE */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2
                    cursor-pointer transition-all
                    ${
                      isDragging
                        ? "border-[#3525cc] bg-[#eae6f5]"
                        : "border-gray-300 bg-gray-50 hover:border-[#3525cc] hover:bg-[#eae6f5]/40"
                    }
                  `}
                >
                  <div
                    className={`p-2.5 rounded-full transition-colors ${isDragging ? "bg-[#3525cc]/10" : "bg-gray-200"}`}
                  >
                    <UploadCloud
                      className={`w-5 h-5 transition-colors ${isDragging ? "text-[#3525cc]" : "text-black/40"}`}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-xs font-medium transition-colors ${isDragging ? "text-[#3525cc]" : "text-black/50"}`}
                    >
                      {isDragging
                        ? "Drop to upload"
                        : "Click or drag & drop to upload"}
                    </p>
                    <p className="text-[10px] text-black/30 mt-0.5">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                  </div>
                </div>
              )}

              {/* HIDDEN FILE INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* ── SERVICE NAME ── */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-black/60">
                Service Name
              </label>
              <input
                name="service_name"
                value={form.service_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10"
              />
            </div>

            {/* ── CATEGORY ── */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-black/60">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10"
              />
            </div>

            {/* ── DESCRIPTION ── */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-black/60">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10 resize-none"
              />
            </div>

            {/* ── DURATION & PRICE ── */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-black/60">
                  Hours
                </label>
                <input
                  name="hour"
                  type="number"
                  min={0}
                  value={form.hour}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-black/60">
                  Minutes
                </label>
                <input
                  name="minute"
                  type="number"
                  min={0}
                  max={59}
                  value={form.minute}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-black/60">
                  Price (₱)
                </label>
                <input
                  name="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3525cc] focus:ring-2 focus:ring-[#3525cc]/10"
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className="px-4 py-2 text-sm bg-[#3525cc] text-white rounded-lg hover:bg-[#2a1db0]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   MANAGE STAFF SIDE PANEL
========================= */

type StaffMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  assigned: boolean;
};

type ManageStaffPanelProps = {
  service: ServiceType;
  onClose: () => void;
};

function ManageStaffPanel({ service, onClose }: ManageStaffPanelProps) {
  const [visible, setVisible] = useState(false);

  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "s1",
      name: "Maria Santos",
      role: "Senior Stylist",
      initials: "MS",
      assigned: true,
    },
    {
      id: "s2",
      name: "Juan Dela Cruz",
      role: "Colorist",
      initials: "JD",
      assigned: false,
    },
    {
      id: "s3",
      name: "Ana Reyes",
      role: "Nail Technician",
      initials: "AR",
      assigned: false,
    },
    {
      id: "s4",
      name: "Carlos Bautista",
      role: "Esthetician",
      initials: "CB",
      assigned: false,
    },
    {
      id: "s5",
      name: "Liza Mendoza",
      role: "Junior Stylist",
      initials: "LM",
      assigned: true,
    },
  ]);

  // Trigger enter animation after mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // wait for exit animation
  };

  const toggleAssign = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, assigned: !s.assigned } : s)),
    );
  };

  const handleSave = () => {
    // Wire your mutation here
    handleClose();
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.4)", opacity: visible ? 1 : 0 }}
      />

      {/* PANEL */}
      <div
        className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-white z-50 shadow-2xl flex flex-col
                   transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold">Manage Staff</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-gray-100 text-black/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-[#eae6f5] rounded-xl p-3 mb-5">
            <p className="text-sm font-semibold text-[#3525cc]">
              {service.service_name}
            </p>
            <p className="text-xs text-black/50 mt-0.5">{service.category}</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
            Staff Members
          </p>

          <div className="flex flex-col gap-3">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50"
              >
                <div className="w-9 h-9 rounded-full bg-[#3525cc] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {staff.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{staff.name}</p>
                  <p className="text-xs text-black/50">{staff.role}</p>
                </div>
                <button
                  onClick={() => toggleAssign(staff.id)}
                  className={`text-[10px] px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                    staff.assigned
                      ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                      : "bg-gray-200 text-black/50 hover:bg-[#eae6f5] hover:text-[#3525cc]"
                  }`}
                >
                  {staff.assigned ? "Assigned" : "Assign"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 text-sm bg-[#3525cc] text-white rounded-lg hover:bg-[#2a1db0]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
