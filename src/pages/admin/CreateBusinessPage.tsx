import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import {
  createBusinessSchema,
  type CreateBusinessDTO,
} from "../../schema/business";
import { useCreateBusiness } from "../../features/business/business.hook";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Building2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";

const STEPS = [
  { label: "Business Info", number: 1 },
  { label: "Details", number: 2 },
  { label: "Review", number: 3 },
];

const CATEGORIES = [
  "Beauty & Wellness",
  "Health & Fitness",
  "Consulting",
  "Education & Tutoring",
  "Legal & Financial",
  "Home Services",
  "Other",
];

type Step = 1 | 2 | 3;

// ── Orb Canvas (same as LoginPage) ───────────────────────────────────────────

const OrbCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    type Orb = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      opacity: number;
    };

    const palette = [
      "rgba(234,230,245,",
      "rgba(44,44,219,",
      "rgba(200,190,240,",
      "rgba(44,44,219,",
      "rgba(220,210,255,",
      "rgba(180,170,230,",
    ];

    const orbs: Orb[] = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 250 + Math.random() * 220,
      color: palette[i % palette.length],
      opacity: 0.18 + Math.random() * 0.15,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(0, orb.color + orb.opacity + ")");
        grad.addColorStop(1, orb.color + "0)");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;
      }

      ctx.fillStyle = "rgba(44,44,219,0.06)";
      const step = 32;
      for (let x = step; x < W; x += step)
        for (let y = step; y < H; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

// ── Logo Upload ───────────────────────────────────────────────────────────────

type LogoUploadProps = {
  preview: string | null;
  onChange: (file: File | null) => void;
};

const LogoUpload = ({ preview, onChange }: LogoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
    e.target.value = "";
  };

  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
        Business Logo{" "}
        <span className="text-gray-300 font-normal normal-case tracking-normal">
          (optional)
        </span>
      </label>

      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="relative flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-[#e2ddf5] hover:border-[#2c2cdb] transition group rounded-xl w-20 h-20 bg-[#f5f5fd]"
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="logo preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                <Upload size={16} className="text-white" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-300 group-hover:text-[#2c2cdb] transition">
              <Building2 size={22} />
              <span className="text-[10px]">Upload</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-[#2c2cdb] font-semibold hover:underline text-left"
          >
            {preview ? "Change logo" : "Upload logo"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"
            >
              <X size={12} /> Remove
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

const CreateBusinessPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [mounted, setMounted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { refetch } = useAuth();
  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const navigate = useNavigate();
  const {
    mutate: createBusiness,
    isPending,
    isError,
    error,
  } = useCreateBusiness();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateBusinessDTO>({
    resolver: zodResolver(createBusinessSchema),
    mode: "onTouched",
  });

  const stepProgress = (step / 3) * 100;

  const stepFields: Record<Step, (keyof CreateBusinessDTO)[]> = {
    1: ["business_name", "category"],
    2: ["description", "email", "phone", "address"],
    3: [],
  };

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid && step < 3) setStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const onSubmit = (data: CreateBusinessDTO) => {
    const formData = new FormData();
    formData.append("business_name", data.business_name);
    formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.address) formData.append("address", data.address);
    if (logoFile) formData.append("logo", logoFile);

    createBusiness(formData, {
      onSuccess: async (data) => {
        console.log(data)
        const result = await refetch();
        const profile = result.data;

        const memberships = profile?.memberships || [];

        if (memberships.length === 0) {
          navigate("/create/business");
          return;
        }

        const role = memberships[0]?.role;

        if (role === "OWNER") {
          navigate("/admin/dashboard");
          return;
        }

        if (role === "STAFF") {
          navigate("/staff/dashboard");
          return;
        }
      },
    });
  };

  const inputClass =
    "w-full bg-white border border-[#e2ddf5] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2c2cdb]/25 focus:border-[#2c2cdb] transition-all duration-200 shadow-sm";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden ">
      <OrbCanvas />

      {/* Header */}
      <header
        className="relative flex items-center justify-between px-8 py-5"
        style={{ zIndex: 10 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2c2cdb] flex items-center justify-center shadow-md shadow-[#2c2cdb]/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" fill="white" />
              <path
                d="M12 2v3M12 19v3M2 12h3M19 12h3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-gray-900 font-bold tracking-tight text-lg">
            Book<span className="text-[#2c2cdb]">ify</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#2c2cdb] tracking-widest uppercase">
            Step {step} of 3
          </span>
          <div className="w-24 h-1.5 bg-[#eae6f5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2c2cdb] rounded-full transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{STEPS[step - 1].label}</span>
        </div>
      </header>

      {/* Main */}
      <main
        className="relative flex-1 flex items-center justify-center px-4 py-10"
        style={{ zIndex: 10 }}
      >
        <div
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          {/* Glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(234,230,245,0.9) 0%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />

          {/* Card */}
          <div
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(234,230,245,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 8px 32px rgba(44,44,219,0.08), 0 2px 8px rgba(44,44,219,0.04), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, #2c2cdb 0%, #a89be8 50%, #eae6f5 100%)",
              }}
            />

            {/* ── Step 1: Business Info ── */}
            {step === 1 && (
              <>
                <div className="mb-7 text-center pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#eae6f5] flex items-center justify-center mx-auto mb-4">
                    <Building2 size={22} className="text-[#2c2cdb]" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                    Set up your business
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Tell us about what you do.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Business Name
                    </label>
                    <input
                      {...register("business_name")}
                      placeholder="Salon Pass"
                      className={inputClass}
                    />
                    {errors.business_name && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.business_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className={inputClass + " bg-white"}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <LogoUpload
                    preview={logoPreview}
                    onChange={handleLogoChange}
                  />
                </div>
              </>
            )}

            {/* ── Step 2: Details ── */}
            {step === 2 && (
              <>
                <div className="mb-7 text-center pt-2">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                    More about you
                  </h1>
                  <p className="text-gray-400 text-sm">
                    All fields are optional.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Briefly describe your business..."
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Business Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="hello@yourbusiness.com"
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Business Phone
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Address
                    </label>
                    <input
                      {...register("address")}
                      placeholder="123 Main St, City, Country"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <>
                <div className="mb-6 text-center pt-2">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                    Almost there!
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Review your business info before creating.
                  </p>
                </div>

                {logoPreview && (
                  <div className="flex justify-center mb-5">
                    <div className="flex flex-col items-center gap-1">
                      <img
                        src={logoPreview}
                        alt="logo"
                        className="w-16 h-16 rounded-xl object-cover border border-[#e2ddf5]"
                      />
                      <span className="text-xs text-gray-400">
                        Business logo
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-xl p-5 mb-5 space-y-3 text-sm"
                  style={{
                    background: "rgba(234,230,245,0.4)",
                    border: "1px solid rgba(234,230,245,0.9)",
                  }}
                >
                  <ReviewRow label="Business" value={watch("business_name")} />
                  <ReviewRow label="Category" value={watch("category")} />
                  {watch("description") && (
                    <ReviewRow
                      label="Description"
                      value={watch("description")!}
                    />
                  )}
                  {watch("email") && (
                    <ReviewRow label="Email" value={watch("email")!} />
                  )}
                  {watch("phone") && (
                    <ReviewRow label="Phone" value={watch("phone")!} />
                  )}
                  {watch("address") && (
                    <ReviewRow label="Address" value={watch("address")!} />
                  )}
                </div>

                {isError && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
                    {(error as Error)?.message ??
                      "Something went wrong. Please try again."}
                  </div>
                )}
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-7">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 px-5 py-3 rounded-xl border border-[#e2ddf5] text-gray-500 text-sm font-medium hover:bg-[#f5f5fd] transition"
                >
                  <ChevronLeft size={15} />
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #2c2cdb 0%, #4a4aff 100%)",
                    boxShadow: "0 4px 20px rgba(44,44,219,0.35)",
                  }}
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #2c2cdb 0%, #4a4aff 100%)",
                    boxShadow: "0 4px 20px rgba(44,44,219,0.35)",
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Business"
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-5 tracking-wide">
            You can update these details anytime from your dashboard.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative flex flex-col sm:flex-row items-center justify-between px-8 py-4 gap-2 text-xs text-gray-400"
        style={{ zIndex: 10 }}
      >
        <span className="font-semibold text-gray-600">Bookify</span>
        <div className="flex gap-5">
          <Link to="/privacy" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </Link>
          <Link to="/help" className="hover:text-gray-700 transition-colors">
            Help Center
          </Link>
        </div>
        <span>© 2024 Bookify. All rights reserved.</span>
      </footer>
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 shrink-0">{label}</span>
    <span className="font-medium text-gray-700 text-right truncate">
      {value}
    </span>
  </div>
);

export default CreateBusinessPage;
