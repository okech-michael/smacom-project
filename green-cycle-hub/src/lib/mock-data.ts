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
  {
    id: "course-001",
    title: "Waste Management Safety Training",
    instructor: "Safety First Institute",
    youtube_channel: "SafetyTraining",
    duration: "45 minutes",
    fee: "KES 2,500",
    modules: 8,
    youtube_url: "https://youtu.be/cqJ-ZM4UZNk"
  },
  {
    id: "course-002",
    title: "Hazardous Waste Management",
    instructor: "Hazmat Professionals",
    youtube_channel: "HazmatAcademy",
    duration: "52 minutes",
    fee: "KES 3,200",
    modules: 6,
    youtube_url: "https://youtu.be/sfsOWSO5H6s"
  },
  {
    id: "course-003",
    title: "Municipal Solid Waste Management",
    instructor: "Urban Waste Solutions",
    youtube_channel: "WasteManagementTV",
    duration: "38 minutes",
    fee: "KES 1,800",
    modules: 5,
    youtube_url: "https://youtu.be/cjIacnNRLHE"
  },
  {
    id: "course-004",
    title: "Singapore Waste Management Strategy",
    instructor: "City Planning Academy",
    youtube_channel: "PlanningExperts",
    duration: "28 minutes",
    fee: "KES 1,500",
    modules: 4,
    youtube_url: "https://www.youtube.com/shorts/zewegWZD0dU"
  },
  {
    id: "course-005",
    title: "Ways of Waste Management",
    instructor: "Environmental Solutions",
    youtube_channel: "EcoLearning",
    duration: "42 minutes",
    fee: "KES 2,000",
    modules: 7,
    youtube_url: "https://youtu.be/o1b4koIeBzQ"
  },
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
