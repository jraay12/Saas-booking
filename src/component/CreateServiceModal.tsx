import { useMemo, useRef, useState } from "react";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import Input from "./Input";
import { services } from "../data/mockdata";
import Search from "./Search";
import { useCreateService } from "../features/service/service.hook";
import { useGetStaffMembers } from "../features/staff/staff.hook";
import type { StaffMember } from "../types/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateServiceModal = ({ onClose, open }: Props) => {
  // EXISTING CATEGORIES
  const categories = useMemo(
    () => Array.from(new Set(services.map((item: any) => item.category))),
    [],
  );

  // CATEGORY
  const [category, setCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // STAFF
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  // IMAGE
  const [image, setImage] = useState<File | null>(null);

  const imagePreview = useMemo(() => {
    if (!image) return null;

    return URL.createObjectURL(image);
  }, [image]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FORM STATE
  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    duration: "",
    price: "",
  });

  // HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemove = (id: string) => {
    setSelectedStaff((prev) => prev.filter((item) => item !== id));
  };

  // OPEN FILE PICKER
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // HANDLE IMAGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
  };

  const {data: staffs} = useGetStaffMembers()
  // FILTER STAFF
  const filteredStaff = staffs?.filter((item: StaffMember) =>
    item.user.first_name.toLowerCase().includes(searchStaff.toLowerCase()),
  );

  const createServiceMutation = useCreateService();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("service_name", form.serviceName);
    formData.append("category", category);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("hour", "1");
    formData.append("minute", form.duration);

    selectedStaff.forEach((staffId) => {
      formData.append("staffs[]", staffId);
    });

    if (image) {
      formData.append("image", image);
    }

    createServiceMutation.mutate(formData, {
      onSuccess: () => {
        console.log("success");
      },
    });
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-2
        transition-all duration-300
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* BACKDROP */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className={`
          relative bg-white w-full max-w-4xl rounded-xl shadow-lg
          overflow-hidden max-h-5/6 overflow-y-auto
          transition-all duration-300 transform
          ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 bg-white text-black border-b border-gray-200">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Add New Service</h1>

            <p className="text-xs text-black/60">
              Define details, assign staff and set availability
            </p>
          </div>

          <button
            type="button"
            className="hover:bg-black/10 p-1 rounded-md transition cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT GRID */}
            <div className="border-r border-gray-200 p-4">
              <h1 className="text-xs font-bold text-black/50 uppercase">
                General Information
              </h1>

              <div className="mt-4 space-y-4">
                {/* SERVICE NAME */}
                <Input
                  label="Service Name"
                  className="bg-white text-xs"
                  placeholder="e.g Deep Tissue Massage"
                  onChange={handleChange}
                  value={form.serviceName}
                  type="text"
                  name="serviceName"
                />

                {/* CATEGORY */}
                <div className="relative">
                  <label className="text-xs font-medium text-black">
                    Category
                  </label>

                  <div className="relative mt-2">
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onFocus={() => setShowCategories(true)}
                      placeholder="Choose or create category"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cc]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCategories((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* DROPDOWN */}
                  {showCategories && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                      {categories
                        .filter((item) =>
                          item.toLowerCase().includes(category.toLowerCase()),
                        )
                        .map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setCategory(item);
                              setShowCategories(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#f5f2ff] transition"
                          >
                            {item}
                          </button>
                        ))}

                      {/* CREATE NEW */}
                      {category && !categories.includes(category) && (
                        <div className="border-t border-gray-100 px-3 py-2 text-xs text-[#3525cc] font-medium">
                          Create new category:
                          <span className="ml-1">"{category}"</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-black/40 mt-1">
                    You can select an existing category or create a new one by
                    typing.
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-xs font-medium text-black">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe what this service includes, expected outcomes, preparation requirements, or any important details clients should know before booking."
                    className="w-full min-h-32 mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none resize-none focus:border-[#3525cc]"
                  />

                  <p className="text-[11px] text-black/40 mt-1">
                    Provide a clear and concise explanation of the service for
                    customers.
                  </p>
                </div>

                {/* DURATION + PRICE */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration"
                    className="bg-white text-xs"
                    placeholder="60 mins"
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                  />

                  <Input
                    label="Price"
                    className="bg-white text-xs"
                    placeholder="₱999"
                    type="text"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT GRID */}
            <div className="p-4">
              <h1 className="text-xs text-black/50 font-bold uppercase">
                Service Image
              </h1>

              {/* UPLOAD BOX */}
              <div
                onClick={handleImageClick}
                className="flex flex-col items-center justify-center w-full border-2 min-h-52 mt-4 rounded-md border-dashed border-gray-300 bg-[#faf9ff] cursor-pointer hover:border-[#3525cc] transition p-4 text-center overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Service"
                    className="w-full h-52 object-cover rounded-md"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-[#3525cc]" />

                    <p className="mt-3 text-sm font-medium text-black">
                      Upload Service Image
                    </p>

                    <p className="text-xs text-black/50 mt-1">
                      Drag and drop an image here or click to browse
                    </p>

                    <p className="text-[11px] text-black/40 mt-3">
                      JPG, PNG • Recommended square or landscape image
                    </p>
                  </>
                )}
              </div>

              {/* HIDDEN INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* ASSIGN STAFF */}
              <div>
                <h1 className="text-xs text-black/50 font-bold uppercase mt-4 mb-6">
                  Assign Staff
                </h1>

                {/* <div className="flex flex-wrap gap-2 mb-4">
                  {selectedStaff.length > 0 &&
                    selectedStaff.map((item) => {
                      return (
                        <BannerStaff
                          key={item}
                          staff_name={item}
                          onClick={() => handleRemove(item)}
                        />
                      );
                    })}
                </div> */}

                <Search
                  placeHolder="Search staff members..."
                  className="text-xs"
                  value={searchStaff ?? ""}
                  onChange={setSearchStaff}
                />

                <AssignStaffSection
                  staff={filteredStaff}
                  selectedStaff={selectedStaff}
                  setSelectedStaff={setSelectedStaff}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#3525cc] text-white rounded-lg hover:bg-[#2d1fb3] transition cursor-pointer"
            >
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;

type AssignStaffProps = {
  staff: any[];
  selectedStaff: string[];
  setSelectedStaff: React.Dispatch<React.SetStateAction<string[]>>;
};

function AssignStaffSection({
  staff,
  selectedStaff,
  setSelectedStaff,
}: AssignStaffProps) {
  const ITEMS_PER_PAGE = 3;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(staff?.length / ITEMS_PER_PAGE);

  const paginatedStaff = staff?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSelect = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="mt-4">
      {/* STAFF LIST */}
      <div className="space-y-3">
        {paginatedStaff?.map((item) => (
          <StaffCard
            key={item.id}
            data={item}
            selected={selectedStaff.includes(item.id)}
            onSelect={() => handleSelect(item.id)}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="text-xs px-3 py-1 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#3525cc]"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md text-xs transition ${
                    currentPage === page
                      ? "bg-[#3525cc] text-white"
                      : "border border-gray-300 hover:border-[#3525cc]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-xs px-3 py-1 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#3525cc]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

type StaffCardProps = {
  data: StaffMember;
  selected: boolean;
  onSelect: () => void;
};

function StaffCard({ data, selected, onSelect }: StaffCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full border rounded-md p-3 text-left transition cursor-pointer ${
        selected
          ? "border-[#3525cc] bg-[#f5f2ff]"
          : "border-gray-300 hover:border-[#3525cc]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-[#eae6f5] flex items-center justify-center text-xs font-semibold text-[#3525cc] overflow-hidden">
            {data.user.avatar ? (
              <img src={`${import.meta.env.VITE_IMAGE_PREFIX}${data.user.avatar}`} className="w-full h-full object-cover" />
            ) : (
              data.user.first_name?.charAt(0)
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <h1 className="text-sm font-medium text-black">{data.user.first_name}</h1>

            <p className="text-xs text-black/50">{data.role}</p>
          </div>
        </div>

        {/* CHECKBOX */}
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition ${
            selected ? "bg-[#3525cc] border-[#3525cc]" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

type BannerStaff = {
  onClick: () => void;
  staff_name: string;
};
function BannerStaff({ onClick, staff_name }: BannerStaff) {
  return (
    <div className="flex items-center gap-2 border w-max px-2 rounded-full border-gray-300 bg-transparent m-2">
      <h1 className="text-xs text-[#3525cc] font-medium">{staff_name}</h1>
      <button onClick={onClick} className="cursor-pointer">
        <X className="w-4" />
      </button>
    </div>
  );
}
