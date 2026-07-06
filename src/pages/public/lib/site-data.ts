export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/solutions", label: "Solutions" },
  { to: "/services", label: "Services" },
  { to: "/technology", label: "Technology" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/learning", label: "Learning" },
  { to: "/projects", label: "Projects" },
  { to: "/impact", label: "Impact" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export const ROLES = [
  {
    key: "waste-producer",
    title: "Waste Producer",
    description:
      "Hotels, restaurants, markets, and municipalities generating organic waste streams.",
  },
  {
    key: "bio-processor",
    title: "Bio-Processor",
    description:
      "Composting and anaerobic digestion facilities converting waste into inputs.",
  },
  {
    key: "farmer",
    title: "Farmer",
    description:
      "Growers sourcing organic fertilizer, biochar, and animal feed from the marketplace.",
  },
  {
    key: "learner",
    title: "Learner",
    description:
      "Students and professionals building expertise on the SMACOM Learning platform.",
  },
  {
    key: "administrator",
    title: "Administrator",
    description:
      "SMACOM operators managing collections, processing, and platform integrity.",
  },
] as const;

export type RoleKey = (typeof ROLES)[number]["key"];
