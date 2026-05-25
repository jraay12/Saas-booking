import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { loginSchema, type LoginDTO } from "../../schema/auth";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../../features/auth/auth.hook";

// ── Animated canvas background (light theme) ─────────────────────────────────

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

    // Light palette: soft violets, brand blue tints, and the #eae6f5 accent
    const palette = [
      "rgba(234,230,245,", // #eae6f5 lavender
      "rgba(44,44,219,", // brand blue
      "rgba(200,190,240,", // soft violet
      "rgba(44,44,219,", // brand blue
      "rgba(220,210,255,", // pale purple
      "rgba(180,170,230,", // muted lavender
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

      // White base
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

      // Fine dot grid
      ctx.fillStyle = "rgba(44,44,219,0.06)";
      const step = 32;
      for (let x = step; x < W; x += step) {
        for (let y = step; y < H; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
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

// ── Login Page ─────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginDTO) => {
    try {
      loginMutation.mutate(data, {
        onSuccess: (data) => {
          localStorage.setItem("access_token", data.token);
          navigate("/admin/dashboard");
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full bg-white border border-[#e2ddf5] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2c2cdb]/25 focus:border-[#2c2cdb] transition-all duration-200 shadow-sm";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
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

        <Link
          to="/register"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          No account?{" "}
          <span className="text-[#2c2cdb] font-semibold hover:underline">
            Sign up
          </span>
        </Link>
      </header>

      {/* Main */}
      <main
        className="relative flex-1 flex items-center justify-center px-4 py-12"
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
          {/* Soft glow behind card */}
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
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, #2c2cdb 0%, #a89be8 50%, #eae6f5 100%)",
              }}
            />

            {/* Heading */}
            <div className="mb-8 text-center pt-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Welcome back
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to your Bookify account
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#2c2cdb] hover:text-[#4a4aff] transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass + " pr-11"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full relative overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 group"
                style={{
                  background:
                    "linear-gradient(135deg, #2c2cdb 0%, #4a4aff 100%)",
                  boxShadow: "0 4px 20px rgba(44,44,219,0.35)",
                }}
              >
                {/* Shimmer on hover */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#eae6f5]" />
              <span className="text-gray-300 text-xs">or</span>
              <div className="flex-1 h-px bg-[#eae6f5]" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#2c2cdb] font-semibold hover:text-[#4a4aff] transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Sub-card badge */}
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

export default LoginPage;
