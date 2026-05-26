import { useEffect, useMemo, useState } from "react";
import { Banknote, Clock, Plus } from "lucide-react";
import Button from "../../component/Button";
import CreateServiceModal from "../../component/CreateServiceModal";
import {
  useGetAllServices,
  useToggleStatus,
} from "../../features/service/service.hook";
import type { Service as ServiceType } from "../../types/types";

const Service = () => {
  const { data: services = [] } = useGetAllServices();
  const toggleMutation = useToggleStatus();
  const [createServiceModal, setCreateServiceModal] = useState(false);

  // CATEGORIES
  const categories = useMemo<string[]>(
    () => [
      "All",
      ...Array.from(
        new Set<string>(services.map((item: ServiceType) => item.category)),
      ),
    ],
    [services],
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  // SERVICES STATE
  const [serviceList, setServiceList] = useState<ServiceType[]>([]);

  useEffect(() => {
    setServiceList(services);
  }, [services]);

  // FILTERED SERVICES
  const filteredServices =
    selectedCategory === "All"
      ? serviceList
      : serviceList.filter((item) => item.category === selectedCategory);

  // TOGGLE ACTIVE / INACTIVE
  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
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
          />
        ))}
      </div>

      <CreateServiceModal
        onClose={() => setCreateServiceModal(false)}
        open={createServiceModal}
      />
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
              ${
                isSelected
                  ? "bg-white text-[#3525cc]"
                  : "text-black/60 hover:bg-white/50"
              }
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
};

function ServiceCard({ data, onToggle }: ServiceCardProps) {
  return (
    <div
      className={`
        border min-h-70 md:max-w-80 rounded-2xl p-4 flex flex-col shadow transition-all duration-300
        ${data.is_active ? "bg-white border-gray-300" : "bg-white border-gray-200 opacity-70"}
      `}
    >
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1
          className={`
            px-2 text-xs py-1 font-medium rounded-md
            ${data.is_active ? "bg-[#eae6f5] text-black" : "bg-gray-100 text-black/60"}
          `}
        >
          {data.category}
        </h1>

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
      </div>

      {/* TITLE */}
      <h1
        className={`
          mt-4 text-2xl max-w-3/4 font-medium transition-all
          ${data.is_active ? "text-black" : "text-black/60"}
        `}
      >
        {data.service_name}
      </h1>

      {/* DESCRIPTION */}
      <p
        className={`
          mt-4 text-xs text-justify transition-all
          ${data.is_active ? "text-black/50" : "text-black/40"}
        `}
      >
        {data.description}
      </p>

      {/* DETAILS */}
      <div className="flex mt-4 gap-10">
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
            ${
              data.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }
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