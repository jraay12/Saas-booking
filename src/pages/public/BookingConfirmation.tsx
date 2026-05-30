import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Info,
  Timer,
  User,
} from "lucide-react";
import { Navigate, useParams, useNavigate } from "react-router";
import { useState } from "react";
import Input from "../../component/Input";
import Button from "../../component/Button";
import { services, staffs } from "../../data/mockdata";
import { useGetServiceById } from "../../features/service/service.hook";
import { convertTo12Hours } from "../../utils/convertTimeTo12";

const BookingConfirmation = () => {
  const booking = JSON.parse(sessionStorage.getItem("booking") || "null");
  const navigate = useNavigate();
  const { slug } = useParams();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  if (
    !booking?.service ||
    !booking?.staff ||
    !booking?.date ||
    !booking?.time ||
    !booking?.totalPrice
  ) {
    return <Navigate to={`/service/${slug}`} replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleConfirmBooking = () => {
    const payload = {
      ...booking,
      customer: form,
    };

    console.log(payload);

    // API request here
  };

  const {data: serviceDetails} = useGetServiceById(booking.service)
  console.log(serviceDetails)

  const staffDetails = staffs.find((item) => item.id === booking.staff);

  const handleBackToSchedule = () => {
    navigate(-1);
    sessionStorage.clear();
  };
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <p className="text-xs text-black/50 font-medium">STEP 2 of 2</p>

      <h1 className="text-4xl font-medium mb-2">Confirm Your Booking</h1>

      <p className="text-black/50 mb-6">
        Please review and complete your details to secure your appointment
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* YOUR DETAILS CARD */}
          <div className="bg-white rounded-xl border p-6 border-gray-300 shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <User size={20} />
              <h1>Your Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Input
                label="First Name"
                placeholder="John"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />

              <Input
                label="Last Name"
                placeholder="Doe"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="mt-5">
                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-5">
                <Input
                  label="Phone Number"
                  placeholder="+63 912 345 6789"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block mb-2 text-sm font-medium">
                Additional Notes{" "}
                <span className="text-xs text-black/50">(Optional)</span>
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add notes or special requests..."
                rows={5}
                className="w-full rounded-xl bg-[#fcf7ff] border border-gray-300 px-4 py-3 outline-none resize-none transition-all focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* PAYMENT METHOD CARD */}
          <PaymentMethod />
          <div className="flex w-full p-4 gap-4 bg-[#f1edfa] rounded-md">
            <Info />
            <p className="text-xs text-black/70 font-medium">
              By clicking "Confirm Booking", you agree to our Terms of Service
              and Cancellation Policy. A confirmation email will be sent to your
              provided address once the booking is processed.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="border border-gray-300 h-max rounded-2xl">
          <div className="bg-[#f5f2ff] border-t border-gray-300 rounded-tl-2xl rounded-tr-2xl p-4">
            <h2 className="text-xl font-bold ">Appointment Summary</h2>
          </div>

          <div className="space-y-5 bg-white border border-gray-300 p-6 shadow-sm h-fit sticky top-5">
            <div className="flex flex-col">
              <h1 className="text-[#3525cc] font-medium">SERVICE</h1>
              <p className="font-bold">{serviceDetails?.service_name}</p>
              <div className="flex text-xs items-center text-black/60 gap-1">
                <Timer className="w-4" />
                <p className="">{serviceDetails?.minute} mins</p>
              </div>
            </div>
            <div className="pb-4 border-b border-gray-300"></div>

            <div className="flex items-start gap-3">
              <User size={18} className="mt-1" />

              <div>
                <p className="text-sm text-black/50">Staff</p>
                <h4 className="font-medium">{staffDetails?.name}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="mt-1" />

              <div>
                <p className="text-sm text-black/50">Date</p>
                <h4 className="font-medium">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 size={18} className="mt-1" />

              <div>
                <p className="text-sm text-black/50">Time</p>
                <h4 className="font-medium">{convertTo12Hours(booking.time)}</h4>
              </div>
            </div>

            <div className="border-t pt-5 flex items-center justify-between">
              <p className="font-bold">Total Price</p>

              <h3 className="text-2xl font-bold text-[#3525cc]">
                ₱{booking.totalPrice}
              </h3>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button name="Confirm Booking" className="w-full" />
              <div
                className="text-[#3525cc] flex gap-1 cursor-pointer"
                onClick={() => handleBackToSchedule()}
              >
                <ArrowLeft />
                <h1>Back to Schedule</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

function PaymentMethod() {
  return (
    <div className="bg-white rounded-xl border p-6 border-gray-300 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Banknote className="text-[#3525cc]" />
        <h2 className="text-lg font-semibold ">Payment Method</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4 lg:gap-10 ">
        <PaymentCards
          label="Pay at Business"
          label1="Pay after your service"
          isSelected={true}
          value="cash"
        />
        <PaymentCards
          label="Credit/Debit Card"
          label1="Secure online checkout"
          isDisabled={true}
          value="bank"
        />
      </div>
    </div>
  );
}

type PaymentCardProps = {
  value: string;
  label: string;
  label1: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
};

function PaymentCards({
  label,
  label1,
  value,
  isDisabled = false,
  isSelected = false,
  onClick,
}: PaymentCardProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`flex items-center h-20 w-full rounded-2xl border-2 gap-4 transition-all px-4 text-left
        ${
          isSelected
            ? "border-[#3525cc] bg-[#e1deff]/30"
            : "border-gray-300 bg-white"
        }
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-[#3525cc] cursor-pointer"
        }
      `}
    >
      <div
        className={`p-2 rounded-full ${
          isSelected ? "bg-[#e1deff]" : "bg-gray-100"
        }`}
      >
        <BriefcaseBusiness size={20} />
      </div>

      <div className="flex-1">
        <h1 className="text-sm font-medium">{label}</h1>
        <p className="text-xs text-black/50">{label1}</p>
      </div>

      {/* RADIO BUTTON */}
      <div className="flex items-center justify-center">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected ? "border-[#3525cc]" : "border-gray-300"}
          `}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#3525cc]" />
          )}
        </div>
      </div>
    </button>
  );
}
