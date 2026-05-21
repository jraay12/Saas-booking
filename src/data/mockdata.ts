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
    id: 1,
    title: "Haircut",
    description:
      "Professional haircut tailored to your preferred style and face shape.",
    amount: 500,
    minutes: 45,
    category: "Hair",
  },

  {
    id: 2,
    title: "Hair Coloring",
    description:
      "Full hair coloring service using premium salon-grade products.",
    amount: 1500,
    minutes: 120,
    category: "Hair",
  },

  {
    id: 3,
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

    name: "John Doe",

    role: "Senior Barber",

    specialties: ["Haircut", "Beard Styling"],

    avatar: "https://i.pravatar.cc/150?img=1",
  },

  {
    id: 2,

    name: "Jane Smith",

    role: "Hair Stylist",

    specialties: ["Hair Coloring", "Hair Treatment"],

    avatar: "https://i.pravatar.cc/150?img=2",
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
