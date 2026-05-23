import { useState } from "react";
import { Banknote, Clock, Plus } from "lucide-react";
import Button from "../../component/Button";
import { services } from "../../data/mockdata";

const Service = () => {
  const categories = [
    "All",
    ...Array.from(
      new Set(services.map((item: any) => item.category))
    ),
  ];

  const [selectedCategory, setSelectedCategory] =
    useState(categories[0]);


  // SERVICES STATE
  const [serviceList, setServiceList] = useState(
    services.map((item: any) => ({
      ...item,
      active: true,
    }))
  );

  // FILTERED SERVICES
  const filteredServices =
    selectedCategory === "All"
      ? serviceList
      : serviceList.filter(
          (item: any) =>
            item.category === selectedCategory
        );

  console.log(filteredServices)

  // TOGGLE ACTIVE / INACTIVE
  const handleToggle = (id: number) => {
    setServiceList((prev: any) =>
      prev.map((item: any) =>
        item.id === id
          ? {
              ...item,
              active: !item.active,
            }
          : item
      )
    );
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">
            Service Management
          </h1>

          <p className="text-sm text-black/50 mt-2 max-w-3/4">
            Configure and manage the service offerings
            available for booking, organize them by
            category, and assign staff members.
          </p>
        </div>

        <Button
          icon={Plus}
          name="Add Service"
          className="max-h-10 max-w-max text-sm"
        />
      </div>

      {/* FILTER */}
      <FilterSection
        service={categories}
        selectedService={selectedCategory}
        onClick={setSelectedCategory}
      />

      <div className="mb-10"></div>

      {/* GRID */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {filteredServices.map((item: any) => (
          <ServiceCard
            key={item.id}
            data={item}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
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
    <div className="flex flex-wrap gap-2 border  border-gray-300 bg-[#eae6f5] min-h-10 rounded-md p-2">
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
  data: any;
  onToggle: () => void;
};

function ServiceCard({
  data,
  onToggle,
}: ServiceCardProps) {
  return (
    <div className="border min-h-70 md:max-w-80 bg-[white] rounded-2xl border-gray-300 p-4 flex flex-col shadow">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="bg-[#eae6f5] px-2 text-xs py-1 font-medium rounded-md">
          {data.category}
        </h1>

        {/* TOGGLE */}
        <button
          onClick={onToggle}
          className={`
            relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer
            ${
              data.active
                ? "bg-[#3525cc]"
                : "bg-gray-300"
            }
          `}
        >
          <div
            className={`
              absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300
              ${
                data.active
                  ? "translate-x-5"
                  : "translate-x-0.5"
              }
            `}
          />
        </button>
      </div>

      {/* TITLE */}
      <h1 className="mt-4 text-2xl max-w-3/4 font-medium">
        {data.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-4 text-xs text-black/50 text-justify">
        {data.description}
      </p>

      {/* DETAILS */}
      <div className="flex mt-4 gap-10">
        <div className="flex items-center text-black/60 gap-2">
          <Clock className="w-4 h-4" />

          <p className="text-xs font-medium">
            {data.minutes} mins
          </p>
        </div>

        <div className="flex items-center text-black/60 gap-2">
          <Banknote className="w-4 h-4" />

          <p className="text-xs font-medium">
            ₱{data.amount}
          </p>
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-4">
        <span
          className={`
            text-[10px] px-2 py-1 rounded-full font-medium
            ${
              data.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {data.active ? "Active" : "Inactive"}
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