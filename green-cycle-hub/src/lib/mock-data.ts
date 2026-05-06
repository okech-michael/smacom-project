// Mock data for SMACOM platform
import { Sprout, Recycle, Tractor, GraduationCap, ShieldCheck } from "lucide-react";

export const ROLES = [
  { id: "producer", title: "Waste Producer", desc: "Log waste, schedule pickups, earn credits", icon: Recycle, path: "/dashboard/producer" },
  { id: "processor", title: "Bio-Processor", desc: "Accept pickups, monitor composting units in real time", icon: Sprout, path: "/dashboard/processor" },
  { id: "farmer", title: "Farmer", desc: "Buy compost and fertiliser from verified processors", icon: Tractor, path: "/dashboard/farmer" },
  { id: "learner", title: "Learner", desc: "Enrol in waste management training and earn certificates", icon: GraduationCap, path: "/dashboard/learner" },
  { id: "admin", title: "Admin", desc: "Manage the full ecosystem from one dashboard", icon: ShieldCheck, path: "/dashboard/admin" },
] as const;

export type RoleId = typeof ROLES[number]["id"];

export const IOT_UNITS = [
  { name: "Unit 1 West", temp: 62, moisture: 58, co2: 1240, fill: 74, stage: "Active Composting", progress: 65, status: "optimal" as const },
  { name: "Unit 2 East", temp: 42, moisture: 61, co2: 890, fill: 52, stage: "Active Composting", progress: 40, status: "alert" as const },
  { name: "Unit 3 North", temp: 58, moisture: 87, co2: 1100, fill: 87, stage: "Maturation", progress: 80, status: "warning" as const },
];

export const PICKUP_REQUESTS = [
  { id: "PU-2041", producer: "Green Grocer Market", type: "Food Waste — Raw Vegetable", quantity: 120, distance: 3.2, address: "Westlands, Nairobi" },
  { id: "PU-2042", producer: "Java House Kilimani", type: "Food Waste — Cooked", quantity: 85, distance: 5.6, address: "Kilimani, Nairobi" },
  { id: "PU-2043", producer: "Karen Country Lodge", type: "Yard Waste — Garden Trim", quantity: 240, distance: 8.1, address: "Karen, Nairobi" },
];

export const PRODUCTS = [
  { name: "Premium Organic Compost", price: "KES 4,500", unit: "/ MT", seller: "GreenCycle Processors", category: "Fertiliser" },
  { name: "Liquid Fertiliser", price: "KES 1,200", unit: "/ 20L", seller: "BioFarm Solutions", category: "Fertiliser" },
  { name: "Animal Feed Mix", price: "KES 2,800", unit: "/ 50kg", seller: "EcoFeed Africa", category: "Feed" },
  { name: "Eco-Packaging Bags", price: "KES 850", unit: "/ pack", seller: "GreenCycle Processors", category: "Packaging" },
  { name: "Biochar Soil Enhancer", price: "KES 3,200", unit: "/ MT", seller: "SoilPro Kenya", category: "Fertiliser" },
  { name: "Worm Castings", price: "KES 1,800", unit: "/ 25kg", seller: "BioFarm Solutions", category: "Fertiliser" },
];

export const COURSES = [
  { title: "Composting Fundamentals", instructor: "Dr. Amina Waweru", duration: "6 hours", fee: "KES 2,500", modules: 8 },
  { title: "Anaerobic Digestion 101", instructor: "John Kamau", duration: "4 hours", fee: "KES 1,800", modules: 6 },
  { title: "Waste Sorting Best Practices", instructor: "Sarah Otieno", duration: "3 hours", fee: "KES 1,200", modules: 5 },
];

export const PRODUCTION_TREND = [
  { month: "Dec", compost: 14, feed: 6 },
  { month: "Jan", compost: 18, feed: 8 },
  { month: "Feb", compost: 16, feed: 7 },
  { month: "Mar", compost: 22, feed: 10 },
  { month: "Apr", compost: 19, feed: 11 },
  { month: "May", compost: 21, feed: 12 },
];

export const INTAKE_LOG = [
  { date: "06 May 2026", producer: "Green Grocer Market", type: "Food Waste", quantity: "120 kg" },
  { date: "06 May 2026", producer: "Java House Kilimani", type: "Food Waste", quantity: "85 kg" },
  { date: "05 May 2026", producer: "Karen Country Lodge", type: "Yard Waste", quantity: "240 kg" },
  { date: "05 May 2026", producer: "Sarit Centre Foods", type: "Food Waste", quantity: "310 kg" },
  { date: "04 May 2026", producer: "Kibera Farmers Co-op", type: "Agricultural Waste", quantity: "560 kg" },
];

export const NOTIFICATIONS = [
  { id: 1, title: "Unit 2 East: moisture below threshold", time: "5 min ago", level: "alert" as const },
  { id: 2, title: "New pickup request from Green Grocer Market", time: "22 min ago", level: "info" as const },
  { id: 3, title: "Order ORD-1042 marked as delivered", time: "1 h ago", level: "info" as const },
  { id: 4, title: "Unit 3 North fill level above 85%", time: "2 h ago", level: "warning" as const },
];
