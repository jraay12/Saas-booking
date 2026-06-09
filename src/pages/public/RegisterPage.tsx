import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { registerSchema, type RegisterDTO } from "../../schema/auth";
import { useRegister } from "../../features/auth/auth.hook";
import { useAuth } from "../../provider/AuthProvider";
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

const STEPS = [
  { label: "Account Setup", number: 1 },
  { label: "Personal Info", number: 2 },
  { label: "Review", number: 3 },
];

type Step = 1 | 2 | 3;

// ── Orb Canvas ────────────────────────────────────────────────────────────────

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

    type Orb = { x: number; y: number; vx: number; vy: number; r: number; color: string; opacity: number };

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
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />;
};

// ── Image Upload ──────────────────────────────────────────────────────────────

type ImageUploadProps = {
  label: string;
  hint?: string;
  preview: string | null;
  onChange: (file: File | null) => void;
  placeholder?: React.ReactNode;
};

const ImageUpload = ({ label, hint, preview, onChange, placeholder }: ImageUploadProps) => {
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
        {label}{" "}
        {hint && <span className="text-gray-300 font-normal normal-case tracking-normal">{hint}</span>}
      </label>

      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="relative flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-[#e2ddf5] hover:border-[#2c2cdb] transition group rounded-full w-20 h-20 bg-[#f5f5fd]"
        >
          {preview ? (
            <>
              <img src={preview} alt="preview" className="w-full h-full object-cover rounded-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                <Upload size={16} className="text-white" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-300 group-hover:text-[#2c2cdb] transition">
              {placeholder ?? <Upload size={20} />}
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
            {preview ? "Change photo" : "Upload photo"}
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

const RegisterPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

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

    if (valid && step < 3) setStep((prev) => (prev + 1) as Step);
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
    "w-full bg-white border border-[#e2ddf5] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2c2cdb]/25 focus:border-[#2c2cdb] transition-all duration-200 shadow-sm";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <OrbCanvas />

      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-5" style={{ zIndex: 10 }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2c2cdb] flex items-center justify-center shadow-md shadow-[#2c2cdb]/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
      <main className="relative flex-1 flex items-center justify-center px-4 py-10" style={{ zIndex: 10 }}>
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
              background: "radial-gradient(circle, rgba(234,230,245,0.9) 0%, transparent 70%)",
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
              boxShadow: "0 8px 32px rgba(44,44,219,0.08), 0 2px 8px rgba(44,44,219,0.04), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, #2c2cdb 0%, #a89be8 50%, #eae6f5 100%)" }}
            />

            {/* ── Step 1: Account Setup ── */}
            {step === 1 && (
              <>
                <div className="mb-7 text-center pt-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create your account</h1>
                  <p className="text-gray-400 text-sm">Get started in just a few steps.</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                      <input {...register("first_name")} placeholder="John" className={inputClass} />
                      {errors.first_name && <p className="text-red-500 text-xs mt-1.5">{errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                      <input {...register("last_name")} placeholder="Doe" className={inputClass} />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1.5">{errors.last_name.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input {...register("email")} type="email" placeholder="you@example.com" className={inputClass} autoComplete="email" />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={inputClass + " pr-11"}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={inputClass + " pr-11"}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mt-1.5">{confirmPasswordError}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Personal Info ── */}
            {step === 2 && (
              <>
                <div className="mb-7 text-center pt-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Personal details</h1>
                  <p className="text-gray-400 text-sm">Add your photo and contact info.</p>
                </div>

                <div className="space-y-5">
                  <ImageUpload
                    label="Profile Photo"
                    hint="(optional)"
                    preview={avatarPreview}
                    onChange={handleAvatarChange}
                    placeholder={<User size={22} className="text-gray-300" />}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                      Phone Number <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">You're all set!</h1>
                  <p className="text-gray-400 text-sm">Review your info before creating your account.</p>
                </div>

                {avatarPreview && (
                  <div className="flex justify-center mb-5">
                    <div className="flex flex-col items-center gap-1">
                      <img src={avatarPreview} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-[#e2ddf5]" />
                      <span className="text-xs text-gray-400">Profile photo</span>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-xl p-5 mb-5 space-y-3 text-sm"
                  style={{ background: "rgba(234,230,245,0.4)", border: "1px solid rgba(234,230,245,0.9)" }}
                >
                  <ReviewRow label="Name" value={`${watch("first_name")} ${watch("last_name")}`} />
                  <ReviewRow label="Email" value={watch("email")} />
                  <ReviewRow label="Phone" value={watch("phone") || "—"} />
                </div>

                {isError && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
                    {(error as Error)?.message ?? "Something went wrong. Please try again."}
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
                    background: "linear-gradient(135deg, #2c2cdb 0%, #4a4aff 100%)",
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
                    background: "linear-gradient(135deg, #2c2cdb 0%, #4a4aff 100%)",
                    boxShadow: "0 4px 20px rgba(44,44,219,0.35)",
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>

            {step === 1 && (
              <>
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#eae6f5]" />
                  <span className="text-gray-300 text-xs">or</span>
                  <div className="flex-1 h-px bg-[#eae6f5]" />
                </div>

                <button
                  type="button"
                  onClick={() => window.location.href = `${import.meta.env.VITE_GOOGLE_AUTH}`}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#e2ddf5] bg-white hover:bg-[#f5f5fd] transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <p className="text-center text-sm text-gray-400 mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#2c2cdb] font-semibold hover:text-[#4a4aff] transition-colors">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>

          <p className="text-center text-gray-400 text-xs mt-5 tracking-wide">
            Trusted by professionals worldwide · Secure · Fast
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
          <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
          <Link to="/help" className="hover:text-gray-700 transition-colors">Help Center</Link>
        </div>
        <span>© 2024 Bookify. All rights reserved.</span>
      </footer>
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 shrink-0">{label}</span>
    <span className="font-medium text-gray-700 text-right truncate">{value}</span>
  </div>
);

export default RegisterPage;