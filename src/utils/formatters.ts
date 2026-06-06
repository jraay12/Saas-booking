
// ─── Greeting ─────────────────────────────────────────────────────────────────
export function getTodayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Date Formatting ──────────────────────────────────────────────────────────
export function getTodayFormatted() {
  return new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Currency Formatting ──────────────────────────────────────────────────────
export function formatPeso(amount: number) {
  return `₱${Number(amount).toLocaleString("en-PH")}`;
}

export function formatPesoK(amount: number) {
  return `₱${(amount / 1000).toFixed(1)}k`;
}
