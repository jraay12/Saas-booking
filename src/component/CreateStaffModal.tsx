import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Eye, EyeOff, X } from "lucide-react";
import Input from "./Input";
import Search from "./Search";
import { services } from "../data/mockdata";
import { useCreateStaff } from "../features/staff/staff.hook";

type Props = {
  onClose?: () => void;
  open: boolean;
};

type CreateStaffDTO = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: FileList;
  business_id?: string;
};

const roles = [
  {
    id: "STAFF",
    title: "Staff Member",
    description:
      "Can manage own schedule, view assigned appointments, and update basic profile info.",
  },
  // {
  //   id: "OWNER",
  //   title: "OWNER",
  //   description:
  //     "Full access to settings, billing, reporting, and managing all staff accounts.",
  // },
];

const CreateStaffModal = ({ onClose, open }: Props) => {
  const [selected, setSelected] = useState("STAFF");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);

  const createStaffMutation = useCreateStaff();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateStaffDTO>();

  const avatar = watch("avatar");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("avatar", e.target.files as FileList);

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const onSubmit = async (data: CreateStaffDTO) => {
    try {
      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.phone) {
        formData.append("phone", data.phone);
      }

      if (data.business_id) {
        formData.append("business_id", data.business_id);
      }

      if (data.avatar?.[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      formData.append("role", selected);
      formData.append(
        "require_password_change",
        String(requirePasswordChange),
      );

      createStaffMutation.mutate(formData, {
        onSuccess: () => {
          reset();
          setImagePreview(null);

          if (onClose) {
            onClose();
          }
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 transition-all duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden max-h-5/6 overflow-y-scroll transition-all duration-300 transform ${
          open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#fcf7ff] text-black">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Create Staff Account</h1>

            <p className="text-xs text-black/60">
              Add a new team member and configure their access.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-black/10 p-1 rounded-md transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
            <div className="flex flex-col items-center w-1/2 gap-2">
              <div
                onClick={handleImageClick}
                className="cursor-pointer flex justify-center items-center rounded-full w-20 h-20 border-2 bg-[#e4e1ed] border-dashed border-gray-300 overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-black/60" />
                )}
              </div>

              <p className="text-xs font-medium">Upload Photo</p>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <Input
                  label="First Name"
                  placeholder="John"
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />

                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />

                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Phone Number (optional)"
                  placeholder="+63 9XX XXX XXXX"
                  type="text"
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 mt-8" />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h1 className="text-xs font-medium">Account Role</h1>

              <div className="space-y-3 mt-5">
                {roles.map((role) => {
                  const isSelected = selected === role.id;

                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelected(role.id)}
                      className={`cursor-pointer rounded-lg border p-4 transition ${
                        isSelected
                          ? "border-[#3525cc] bg-[#f5f2ff]"
                          : "border-gray-300 bg-white hover:border-[#3525cc]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-[#3525cc]"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#3525cc]" />
                            )}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-sm font-medium text-black">
                            {role.title}
                          </h2>

                          <p className="text-xs text-black/60 mt-1 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="text-xs font-medium">Initial Password</h1>

              <div className="mt-5 relative">
                <Input
                  placeholder="Create a strong password"
                  label=""
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={requirePasswordChange}
                  onChange={(e) =>
                    setRequirePasswordChange(e.target.checked)
                  }
                  className="accent-[#3525cc] cursor-pointer"
                />

                <p className="text-xs text-black/70">
                  Require password change on first login
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 mt-8" />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-black/60 hover:text-black cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createStaffMutation.isPending}
              className="px-4 py-2 text-sm bg-[#3525cc] text-white rounded-md hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {createStaffMutation.isPending
                ? "Creating..."
                : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffModal;

function AssignService() {
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const filteredServices = services.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((serviceId) => serviceId !== id)
        : [...prev, id],
    );
  };

  const handleRemove = (id: string) => {
    setSelectedServices((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between">
        <h1 className="text-xs font-medium">Assign Services</h1>

        <p className="text-xs text-black/60">
          {selectedServices.length > 0
            ? `${selectedServices.length} selected `
            : ""}
        </p>
      </div>

      <div className="flex flex-col border mt-4 rounded-lg bg-[#f1edfa] border-gray-200 p-4 max-h-50 overflow-y-scroll">
        <Search
          placeHolder="Search services..."
          className="bg-white text-sm"
          value={search}
          onChange={setSearch}
        />

        <div className="flex">
          {selectedServices.length > 0 &&
            selectedServices.map((item) => {
              const serviceDetails = services.find(
                (service) => item === service.id,
              );

              return (
                <BannerService
                  key={item}
                  service_name={serviceDetails?.title!}
                  onClick={() => handleRemove(item)}
                />
              );
            })}
        </div>

        <div className="flex flex-col">
          {filteredServices.length > 0 ? (
            filteredServices.map((item) => {
              const isChecked = selectedServices.includes(item.id);

              return (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 rounded-md p-3 cursor-pointer transition ${
                    isChecked
                      ? ""
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(item.id)}
                    className="accent-[#3525cc] cursor-pointer"
                  />

                  <p className="text-sm text-black">{item.title}</p>
                </label>
              );
            })
          ) : (
            <div className="flex items-center justify-center py-6">
              <p className="text-sm text-black/50">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type BannerServicePrps = {
  onClick: () => void;
  service_name: string;
};

function BannerService({
  onClick,
  service_name,
}: BannerServicePrps) {
  return (
    <div className="flex items-center gap-2 border w-max px-2 rounded-full border-gray-300 bg-transparent m-2">
      <h1 className="text-xs text-[#3525cc] font-medium">
        {service_name}
      </h1>

      <button onClick={onClick} className="cursor-pointer">
        <X className="w-4" />
      </button>
    </div>
  );
}