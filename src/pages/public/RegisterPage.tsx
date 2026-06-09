import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { registerSchema, type RegisterDTO } from "../../schema/auth";
import { useRegister } from "../../features/auth/auth.hook";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";

const STEPS = [
  { label: "Account Setup", number: 1 },
  { label: "Personal Info", number: 2 },
  { label: "Review", number: 3 },
];

type Step = 1 | 2 | 3;

// ── Image Upload Component ────────────────────────────────────────────────────

type ImageUploadProps = {
  label: string;
  hint?: string;
  preview: string | null;
  onChange: (file: File | null) => void;
  placeholder?: React.ReactNode;
};

const ImageUpload = ({
  label,
  hint,
  preview,
  onChange,
  placeholder,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
    e.target.value = "";
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {hint && <span className="text-gray-400 font-normal">{hint}</span>}
      </label>

      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="relative flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#2c2cdb] transition group rounded-full w-24 h-24 bg-[#f5f5fd]"
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                <Upload size={18} className="text-white" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 group-hover:text-[#2c2cdb] transition">
              {placeholder ?? <Upload size={20} />}
              <span className="text-xs mt-1">Upload</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-[#2c2cdb] font-medium hover:underline text-left"
          >
            {preview ? "Change photo" : "Upload photo"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600"
            >
              <X size={13} /> Remove
            </button>
          )}
          <p className="text-xs text-gray-400">JPG, PNG, WEBP · max 5 MB</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();
  const { refetch } = useAuth();
  const { mutate: createAccount, isPending, isError, error } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const password = watch("password");
  const stepProgress = (step / 3) * 100;

  const stepFields: Record<Step, (keyof RegisterDTO)[]> = {
    1: ["first_name", "last_name", "email", "password"],
    2: ["phone"],
    3: [],
  };

  const handleNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);

    if (step === 1) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        return;
      } else {
        setConfirmPasswordError("");
      }
    }

    if (valid && step < 3) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const onSubmit = (data: RegisterDTO) => {
    const formData = new FormData();

    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) formData.append("phone", data.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    createAccount(formData, {
      onSuccess: async (data) => {
        localStorage.setItem("access_token", data.token);
        await refetch();
        navigate("/create/business");
      },
    });
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c2cdb]/30 focus:border-[#2c2cdb] transition";

  return (
    <div className="min-h-screen flex flex-col bg-[#f0effa]">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        {/* Progress Bar */}
        <div className="w-full max-w-lg mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[#2c2cdb] tracking-widest uppercase">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500">
              {STEPS[step - 1].label}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2c2cdb] rounded-full transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
          {/* ── Step 1: Account Setup ── */}
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create your account
              </h1>
              <p className="text-gray-500 text-center mb-8">
                Get started in just a few steps.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...register("first_name")}
                    placeholder="John"
                    className={inputClass}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...register("last_name")}
                    placeholder="Doe"
                    className={inputClass}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </>
          )}

          {/* ── Step 2: Personal Info ── */}
          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Personal details
              </h1>
              <p className="text-gray-500 text-center mb-8">
                Add your photo and contact info.
              </p>

              <ImageUpload
                label="Profile Photo"
                hint="(optional)"
                preview={avatarPreview}
                onChange={handleAvatarChange}
                placeholder={<User size={28} className="text-gray-300" />}
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                You're all set!
              </h1>
              <p className="text-gray-500 text-center mb-6">
                Review your info and confirm to create your account.
              </p>

              {avatarPreview && (
                <div className="flex justify-center mb-6">
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#2c2cdb]/20"
                    />
                    <span className="text-xs text-gray-400">Profile photo</span>
                  </div>
                </div>
              )}

              <div className="bg-[#f0effa] rounded-xl p-5 mb-6 space-y-3 text-sm">
                <ReviewRow
                  label="Name"
                  value={`${watch("first_name")} ${watch("last_name")}`}
                />
                <ReviewRow label="Email" value={watch("email")} />
                <ReviewRow label="Phone" value={watch("phone") || "—"} />
              </div>

              {isError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {(error as Error)?.message ??
                    "Something went wrong. Please try again."}
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1 bg-[#2c2cdb] hover:bg-[#2020c0] text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2c2cdb] hover:bg-[#2020c0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#2c2cdb] font-semibold hover:underline"
              >
                Log in
              </a>
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span className="font-bold text-gray-800">Bookify</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-gray-700 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-700 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-700 transition">
            Help Center
          </a>
        </div>
        <span className="text-xs">© 2024 Bookify. All rights reserved.</span>
      </footer>
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
      {value}
    </span>
  </div>
);

export default RegisterPage;
