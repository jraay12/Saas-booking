import { Banknote, Check, Timer } from "lucide-react";

type Service = {
  id: string;
  business_id: string;
  service_name: string;
  category: string;
  description: string | null;
  price: string;
  hour: number;
  minute: number;
  image_path: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  service: Service;
  serviceSelected: string | null;
  onSelect: () => void;
};

const ServiceCard = ({ service, serviceSelected, onSelect }: Props) => {
  return (
    <div
      className={`relative p-4 w-full border rounded-xl shadow-md min-h-30 flex flex-col cursor-pointer ${
        serviceSelected === service.id ? "border-[#3525cc]" : "border-gray-300"
      }`}
      onClick={onSelect}
    >
      {serviceSelected === service.id && (
        <div className="absolute -top-3 right-4 bg-[#3525cc] text-white text-xs px-3 py-1 rounded-md shadow-md font-medium">
          Selected
        </div>
      )}

      <div
        className={`absolute top-11 hidden md:block  bg-[#f5f2ff] text-black text-xs ${serviceSelected === service.id ? "px-2 right-8" : "px-4 right-4"}  py-2 rounded-md shadow-md `}
      >
        {serviceSelected === service.id ? <Check /> : "Select"}
      </div>

      <h1 className="text-xl font-medium">{service.service_name}</h1>

      <p className="text-xs text-black/70 font-medium max-w-5/6">
        {service.description}
      </p>

      <div className="flex mt-2 gap-4 items-center">
        <div className="flex items-center gap-1 text-black/50">
          <Timer className="w-4" />
          <p className="text-xs">{service.minute} min</p>
        </div>

        <div className="flex items-center gap-1 text-[#3525cc] font-bold">
          <Banknote className="w-4" />
          <p className="text-xs">From {service.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
