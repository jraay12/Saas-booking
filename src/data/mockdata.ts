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
