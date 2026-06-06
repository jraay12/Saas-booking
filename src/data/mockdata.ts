export const business = {
  id: 1,

  slug: "glow-salon",

  name: "Glow Salon Studio",

  tagline: "Premium beauty and self-care experience.",

  description:
    "Glow Salon Studio offers modern hair styling, coloring, and grooming services designed to help you look and feel your best.",

  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300",

  coverImage:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1400",

  phone: "+63 912 345 6789",

  email: "hello@glowsalon.com",

  address: "Cagayan de Oro City, Philippines",

  website: "https://glowsalon.com",

  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },

  businessHours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 7:00 PM",
    sunday: "Closed",
  },

  theme: {
    primaryColor: "#4F46E5",
    accentColor: "#06B6D4",
    backgroundColor: "#F8FAFC",
    surfaceColor: "#FFFFFF",
    textColor: "#0F172A",
  },
};

export const services = [
  {
    id: "1",
    title: "Haircut",
    description:
      "Professional haircut tailored to your preferred style and face shape.",
    amount: 500,
    minutes: 45,
    category: "Hair",
  },

  {
    id: "2",
    title: "Hair Coloring",
    description:
      "Full hair coloring service using premium salon-grade products.",
    amount: 1500,
    minutes: 120,
    category: "Hair",
  },

  {
    id: "3",
    title: "Beard Trim",
    description: "Clean and precise beard shaping with detailed finishing.",
    amount: 300,
    minutes: 20,
    category: "Grooming",
  },
  
];

export const staffs = [
  {
    id: 1,
    name: "John",
    role: "Senior Barber",
    specialties: ["Haircut", "Beard Styling"],
    description:
      "",
    avatar: "",
  },
  {
    id: 2,
    name: "Jane",
    role: "Hair Stylist",
    specialties: ["Hair Coloring", "Hair Treatment"],
    description:
      "Specializes in vibrant hair coloring and restorative treatments that bring damaged hair back to life.",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Michael",
    role: "Barber",
    specialties: ["Fade Cut", "Shaving"],
    description:
      "Focuses on sharp fades and clean shaves with attention to detail for a polished finish.",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Sarah",
    role: "Senior Hair Stylist",
    specialties: ["Balayage", "Hair Treatment"],
    description:
      "Expert in balayage techniques and personalized hair treatments tailored to each client.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "David",
    role: "Barber",
    specialties: ["Classic Cut", "Beard Trim"],
    // ❌ NO DESCRIPTION (test empty state)
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Emily",
    role: "Hair Stylist",
    specialties: ["Hair Coloring", "Keratin Treatment"],
    description:
      "Specialist in smooth, frizz-free hair transformations using keratin and advanced coloring techniques.",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Chris",
    role: "Junior Barber",
    specialties: ["Basic Cut", "Shave"],
    // ❌ NO DESCRIPTION
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "Anna",
    role: "Hair Specialist",
    specialties: ["Rebonding", "Hair Spa"],
    description:
      "Passionate about hair rebonding and spa treatments that restore shine and smoothness.",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 9,
    name: "Mark",
    role: "Barber",
    specialties: ["Fade", "Line Up"],
    description:
      "Known for precise line-ups and modern fade styles suited for all face shapes.",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 10,
    name: "Sophia",
    role: "Senior Stylist",
    specialties: ["Hair Coloring", "Styling"],
    // ❌ NO DESCRIPTION
    avatar: "https://i.pravatar.cc/150?img=10",
  },
];

export const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
];


// ─── Today's Schedule ────────────────────────────────────────────────────────
export const TODAY_SCHEDULE = [
  {
    id: "1",
    time: "09:00",
    duration: "60 min",
    client: "Sofia Reyes",
    service: "Swedish Relaxation",
    staff: "M. Santos",
    status: "CONFIRMED",
  },
  {
    id: "2",
    time: "10:30",
    duration: "90 min",
    client: "Marco Tan",
    service: "Deep Tissue Massage",
    staff: "J. dela Cruz",
    status: "CONFIRMED",
  },
  {
    id: "3",
    time: "13:00",
    duration: "60 min",
    client: "Camille Lim",
    service: "Foot Reflexology",
    staff: "A. Bautista",
    status: "PENDING",
  },
  {
    id: "4",
    time: "14:30",
    duration: "45 min",
    client: "Diego Villanueva",
    service: "Aromatherapy",
    staff: "M. Santos",
    status: "CONFIRMED",
  },
  {
    id: "5",
    time: "16:00",
    duration: "60 min",
    client: "Isabel Cruz",
    service: "Sports Massage",
    staff: "J. dela Cruz",
    status: "PENDING",
  },
];

// ─── Recent Bookings ──────────────────────────────────────────────────────────
export const RECENT_BOOKINGS = [
  {
    id: "bk-001",
    first_name: "Alex",
    last_name: "Johnson",
    service: { service_name: "Hot Stone Therapy" },
    staff: { first_name: "Ana", last_name: "Bautista" },
    booking_date: "2025-06-14",
    start_time: "10:00",
    status: "COMPLETED",
    service_price: "1500",
  },
  {
    id: "bk-002",
    first_name: "Sofia",
    last_name: "Reyes",
    service: { service_name: "Swedish Relaxation" },
    staff: { first_name: "Maria", last_name: "Santos" },
    booking_date: "2025-06-13",
    start_time: "13:30",
    status: "CONFIRMED",
    service_price: "900",
  },
  {
    id: "bk-003",
    first_name: "Marco",
    last_name: "Tan",
    service: { service_name: "Deep Tissue Massage" },
    staff: { first_name: "Juan", last_name: "dela Cruz" },
    booking_date: "2025-06-13",
    start_time: "09:00",
    status: "PENDING",
    service_price: "1200",
  },
  {
    id: "bk-004",
    first_name: "Camille",
    last_name: "Lim",
    service: { service_name: "Foot Reflexology" },
    staff: { first_name: "Ana", last_name: "Bautista" },
    booking_date: "2025-06-12",
    start_time: "15:00",
    status: "CANCELLED",
    service_price: "750",
  },
  {
    id: "bk-005",
    first_name: "Diego",
    last_name: "Villanueva",
    service: { service_name: "Aromatherapy Massage" },
    staff: { first_name: "Maria", last_name: "Santos" },
    booking_date: "2025-06-12",
    start_time: "11:00",
    status: "COMPLETED",
    service_price: "1100",
  },
];

// ─── Staff Data ───────────────────────────────────────────────────────────────
export const STAFF_DATA = [
  { name: "Maria Santos", sessions: 2, max: 4, color: "#534AB7" },
  { name: "Juan dela Cruz", sessions: 2, max: 4, color: "#185FA5" },
  { name: "Ana Bautista", sessions: 1, max: 4, color: "#1D9E75" },
];

// ─── Top Services ─────────────────────────────────────────────────────────────
export const TOP_SERVICES = [
  { name: "Swedish Relaxation", revenue: 9800, color: "#534AB7" },
  { name: "Deep Tissue Massage", revenue: 8400, color: "#185FA5" },
  { name: "Hot Stone Therapy", revenue: 7200, color: "#1D9E75" },
  { name: "Aromatherapy", revenue: 5100, color: "#BA7517" },
  { name: "Foot Reflexology", revenue: 4200, color: "#E24B4A" },
];

// ─── Revenue Data ─────────────────────────────────────────────────────────────
export const REVENUE_DATA = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [8200, 11500, 9800, 13200, 10400, 15600, 12800],
    target: [10000, 10000, 10000, 10000, 10000, 10000, 10000],
  },
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [42000, 56000, 49000, 61000],
    target: [50000, 50000, 50000, 50000],
  },
};

// ─── Hourly Data ──────────────────────────────────────────────────────────────
export const HOURLY_DATA = {
  labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"],
  data: [1, 1, 0, 0, 1, 1, 0, 1, 0],
};

// ─── Status Donut ─────────────────────────────────────────────────────────────
export const STATUS_DONUT = {
  labels: ["Confirmed", "Completed", "Pending", "Cancelled"],
  data: [45, 25, 20, 10],
  colors: ["#185FA5", "#1D9E75", "#EF9F27", "#E24B4A"],
};
