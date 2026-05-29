import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center overflow-hidden px-6 py-16">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f0ece4 1px, transparent 1px), linear-gradient(to bottom, #f0ece4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial fade overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #ffffff 30%, transparent 100%)",
        }}
      />

      {/* Corner brackets */}
      {[
        "top-5 left-5 border-t border-l",
        "top-5 right-5 border-t border-r",
        "bottom-5 left-5 border-b border-l",
        "bottom-5 right-5 border-b border-r",
      ].map((cls, i) => (
        <span
          key={i}
          className={`absolute w-6 h-6 border-stone-300 opacity-40 ${cls}`}
        />
      ))}

      {/* Dot accents */}
      {[
        "top-16 left-20",
        "top-24 right-24",
        "bottom-20 left-28",
        "bottom-16 right-20",
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full bg-stone-300 ${pos}`}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        {/* 404 numeral */}
        <h1
          className="text-[120px] leading-none tracking-[-4px] text-stone-900 select-none"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          4<span className="italic text-stone-400">0</span>4
        </h1>

        {/* Divider */}
        <span className="block w-14 h-px bg-stone-900 mt-4 mb-6" />

        {/* Headline */}
        <p
          className="text-[22px] text-stone-900 font-normal tracking-tight mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          This page doesn't exist
        </p>

        {/* Sub-copy */}
        <p className="text-sm text-stone-400 font-light leading-relaxed mb-10">
          The page you're looking for may have been moved,
          <br />
          renamed, or perhaps never existed at all.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-7 py-2.5 bg-stone-900 text-white text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-stone-700 transition-colors duration-200 cursor-pointer"
          >
            Go home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-7 py-2.5 bg-transparent text-stone-400 text-xs font-medium uppercase tracking-widest rounded-sm border border-stone-200 hover:border-stone-400 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
          >
            Go back
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="mt-12 flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-300">
          <span>Home</span>
          <span className="text-stone-200">/</span>
          <span>...</span>
          <span className="text-stone-200">/</span>
          <span className="text-stone-400">Not found</span>
        </div>
      </div>

      {/* Google Fonts — add to your index.html instead if preferred */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </div>
  );
}