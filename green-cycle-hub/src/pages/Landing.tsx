import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/smacom/Logo";
import { Header } from "@/components/smacom/Header";
import { SEOSchema } from "@/components/smacom/SEOSchema";
import { ProductCard } from "@/components/smacom/ProductCard";
import { CourseCard } from "@/components/smacom/CourseCard";
import { IoTUnitCard } from "@/components/smacom/IoTUnitCard";
import { ROLES, PRODUCTS, COURSES, IOT_UNITS } from "@/lib/mock-data";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight, ClipboardCheck, Camera, Truck, ShoppingCart, BookOpen, Activity,
  Radio, MapPin, Sparkles, Store, Check, X, Home, BarChart2, GraduationCap,
  User, Menu, Leaf, Zap, Globe, TrendingUp, ChevronRight, Play,
  Cpu, Droplets, Wind, Sun,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────── */

const STEPS = [
  { icon: ClipboardCheck, title: "Register & Verify", desc: "Create an account and complete verification in minutes.", color: "from-emerald-500 to-teal-500" },
  { icon: Camera, title: "Log Waste", desc: "Producers upload a photo and pin their location.", color: "from-teal-500 to-cyan-500" },
  { icon: Truck, title: "Pickup", desc: "Bio-Processor accepts and collects waste efficiently.", color: "from-cyan-500 to-sky-500" },
  { icon: ShoppingCart, title: "Marketplace", desc: "Farmers buy verified compost and fertiliser.", color: "from-sky-500 to-emerald-500" },
  { icon: BookOpen, title: "Learn", desc: "Learners enrol in certified waste training.", color: "from-emerald-500 to-lime-500" },
  { icon: Activity, title: "Monitor", desc: "Admins track every metric in real time.", color: "from-lime-500 to-emerald-500" },
];

const FEATURES = [
  { icon: Radio, title: "Real-Time IoT Monitoring", desc: "Sensors stream temperature, moisture and CO₂ data continuously.", glow: "rgba(16,185,129,0.15)" },
  { icon: MapPin, title: "GPS-Based Waste Matching", desc: "Pickup requests routed to the nearest verified processor.", glow: "rgba(20,184,166,0.15)" },
  { icon: Camera, title: "Waste Photo Uploads", desc: "Quality and contamination flagged automatically at submission.", glow: "rgba(6,182,212,0.15)" },
  { icon: Sparkles, title: "AI Soil Recommendations", desc: "Tailored compost suggestions per soil sample and crop type.", glow: "rgba(16,185,129,0.15)" },
  { icon: Store, title: "Eco-Marketplace", desc: "Verified buyers and sellers with built-in secure escrow.", glow: "rgba(20,184,166,0.15)" },
  { icon: BookOpen, title: "Integrated Learning", desc: "Courses and certifications for the whole ecosystem.", glow: "rgba(132,204,22,0.15)" },
];

const IMPACT = [
  { value: 1240, display: "1,240", unit: "MT", label: "Waste Diverted", icon: Leaf },
  { value: 620, display: "620", unit: "T", label: "CO₂ Saved", icon: Wind },
  { value: 480, display: "480", unit: "MT", label: "Compost Produced", icon: Droplets },
  { value: 3200, display: "3,200", unit: "+", label: "Registered Users", icon: Globe },
];

const TICKER_ITEMS = [
  "🌿 1,240 MT Waste Diverted",
  "⚡ 620 Tonnes CO₂ Saved",
  "🌱 480 MT Compost Produced",
  "👥 3,200+ Registered Users",
  "🔄 Circular Economy Platform",
  "📡 Real-Time IoT Monitoring",
  "🤖 AI-Powered Recommendations",
  "🌍 Powering African Agriculture",
];

/* ─── Reusable Animations ────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp} custom={delay} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Animated Counter ───────────────────────────────────── */

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0</span>;
}

/* ─── Live Ticker ────────────────────────────────────────── */

function LiveTicker() {
  return (
    <div className="relative overflow-hidden bg-emerald-950/60 border-y border-emerald-500/20 py-2.5">
      <div className="flex">
        {[0, 1].map((pass) => (
          <motion.div
            key={pass}
            className="flex gap-12 shrink-0 pr-12"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {TICKER_ITEMS.map((item) => (
              <span key={item} className="text-xs font-medium text-emerald-400/80 whitespace-nowrap tracking-wide">
                {item}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section Header ─────────────────────────────────────── */

function SectionHeader({ eyebrow, title, subtitle, light = false }: { eyebrow: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <FadeUp className="max-w-2xl">
      <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-3 ${light ? "text-emerald-300" : "text-emerald-500"}`}>
        <span className="h-px w-6 bg-current" />
        {eyebrow}
      </span>
      <h2 className={`text-3xl md:text-5xl font-black tracking-tight leading-[1.05] ${light ? "text-white" : ""}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base ${light ? "text-emerald-100/70" : "text-muted-foreground"}`}>{subtitle}</p>}
    </FadeUp>
  );
}

/* ─── Floating Metric Card ───────────────────────────────── */

function FloatingCard({ value, label, icon: Icon, delay, className = "" }: { value: string; label: string; icon: React.ElementType; delay: number; className?: string }) {
  return (
    <motion.div
      className={`absolute backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ opacity: { duration: 0.6, delay }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay } }}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-white/50 leading-none mb-0.5">{label}</p>
          <p className="text-sm font-bold text-white leading-none">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── IoT Live Widget ────────────────────────────────────── */

function IoTWidget() {
  const [temp, setTemp] = useState(62);
  const [moisture, setMoisture] = useState(74);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((t) => Math.max(55, Math.min(75, t + (Math.random() - 0.5) * 2)));
      setMoisture((m) => Math.max(65, Math.min(85, m + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="backdrop-blur-xl bg-black/40 border border-emerald-500/20 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-emerald-400/70 font-medium uppercase tracking-wider">Live Composter</p>
          <p className="text-sm font-bold text-white mt-0.5">Unit Alpha-03 · Nairobi</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Temperature", value: `${temp.toFixed(1)}°C`, color: "text-orange-400", bar: (temp - 50) / 30 },
          { label: "Moisture", value: `${moisture.toFixed(1)}%`, color: "text-cyan-400", bar: moisture / 100 },
          { label: "CO₂ ppm", value: "847", color: "text-lime-400", bar: 0.65 },
        ].map((m) => (
          <div key={m.label} className="bg-white/5 rounded-xl p-3">
            <p className="text-[10px] text-white/40 mb-1">{m.label}</p>
            <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                animate={{ width: `${m.bar * 100}%` }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="h-24 relative">
        <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,40 Q20,35 40,30 T80,25 T120,28 T160,20 T200,18 L200,60 L0,60 Z" fill="url(#lineGrad)" />
          <path d="M0,40 Q20,35 40,30 T80,25 T120,28 T160,20 T200,18" fill="none" stroke="#10b981" strokeWidth="1.5" />
        </svg>
        <p className="absolute bottom-0 right-0 text-[10px] text-white/30">12h temperature trend</p>
      </div>
    </div>
  );
}

/* ─── Main Landing Page ──────────────────────────────────── */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://smacom.co.ke";
  const logoUrl = `${siteUrl}/logo.jpg`;

  return (
    <div className="min-h-screen bg-[#050c08] text-white overflow-x-hidden">
      {/* SEO Schema */}
      <SEOSchema
        title="SMACOM Solutions — Turn Organic Waste Into Wealth"
        description="SMACOM connects waste producers, bio-processors and farmers in one intelligent platform — powered by IoT sensors, AI recommendations and a live marketplace."
        url={siteUrl}
        image={logoUrl}
      />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-emerald-950/30 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      {/* ── Semantic Header with Navigation ── */}
      <Header scrolled={scrolled} />

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Waste-to-Wealth Intelligence Platform
              </span>
            </FadeUp>
            <FadeUp delay={1}>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.0]">
                Turn Organic<br />
                Waste Into{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
                    Wealth
                  </span>
                  <motion.span
                    className="absolute -inset-2 bg-emerald-400/10 rounded-xl blur-xl -z-10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={2}>
              <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                SMACOM connects waste producers, bio-processors and farmers in one intelligent platform — powered by IoT sensors, AI recommendations and a live marketplace.
              </p>
            </FadeUp>
            <FadeUp delay={3}>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-2xl shadow-emerald-500/30 h-12 px-8">
                  <Link to="/register">Get Started Free <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/15 text-white/80 hover:bg-white/5 hover:text-white h-12 px-8">
                  <a href="#how">
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    See How It Works
                  </a>
                </Button>
              </div>
            </FadeUp>

            {/* Trust badges */}
            <FadeUp delay={4}>
              <div className="flex items-center gap-6 pt-4">
                {[{ icon: Zap, label: "AI-Powered" }, { icon: Globe, label: "Pan-Africa" }, { icon: Leaf, label: "Carbon-Negative" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-white/40 font-medium">
                    <Icon className="h-3.5 w-3.5 text-emerald-500" />
                    {label}
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right – Dashboard Visual */}
          <FadeUp delay={2} className="relative">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-3xl scale-110" />

              {/* Main dashboard card */}
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-6 shadow-2xl">
                <IoTWidget />

                {/* Metric row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {IMPACT.slice(0, 3).map((s) => (
                    <motion.div
                      key={s.label}
                      className="rounded-xl border border-white/8 bg-white/5 p-3"
                      whileHover={{ scale: 1.03, borderColor: "rgba(16,185,129,0.3)" }}
                    >
                      <p className="text-lg font-black text-white">{s.display}
                        <span className="text-xs font-semibold text-white/40 ml-1">{s.unit}</span>
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard value="62.4°C" label="Avg. Temp" icon={Activity} delay={0.5} className="-top-8 -left-8 hidden lg:flex" />
              <FloatingCard value="+12 today" label="New Pickups" icon={Truck} delay={1.2} className="-bottom-6 -right-8 hidden lg:flex" />
              <FloatingCard value="KES 4,200" label="Today's Sales" icon={TrendingUp} delay={0.9} className="top-1/2 -right-12 -translate-y-1/2 hidden xl:flex" />
            </div>
          </FadeUp>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-emerald-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* ── Live Ticker ── */}
      <div className="relative z-10">
        <LiveTicker />
      </div>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="How it works" title="From waste to wealth in six steps" subtitle="A seamless end-to-end flow connecting every actor in the circular economy." />

          <div className="mt-16 relative">
            {/* Connection line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="grid lg:grid-cols-6 gap-6">
              {STEPS.map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.08}>
                  <motion.div className="group relative" whileHover={{ y: -4 }}>
                    <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg mb-4`}>
                      <s.icon className="h-6 w-6 text-white" />
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white/10 backdrop-blur text-[10px] font-black text-white flex items-center justify-center border border-white/20">{i + 1}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-tight mb-1.5">{s.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles / Who It's For ── */}
      <section id="who-its-for" className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Built for everyone" title="Who is SMACOM for?" subtitle="Every role in the waste-to-wealth chain has a dedicated, purpose-built experience." />
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {ROLES.filter(r => r.id !== 'admin').map((r, i) => (
              <motion.div key={r.id} variants={fadeUp} custom={i}>
                <motion.div
                  className="group relative rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent p-6 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(16,185,129,0.1)" }}
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-4 group-hover:bg-emerald-500/25 transition-colors">
                    <r.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{r.title}</h3>
                  <p className="text-sm text-white/50 mt-2 leading-relaxed">{r.desc}</p>
                  <Link to={r.path} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-28 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Platform capabilities" title="Everything you need to run a circular operation" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <motion.div
                  className="group relative rounded-2xl border border-white/8 p-6 overflow-hidden transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  whileHover={{ borderColor: "rgba(16,185,129,0.25)", y: -4 }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${f.glow}, transparent 70%)` }} />
                  <div className="relative">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-white">{f.title}</h3>
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marketplace ── */}
      <section id="marketplace" className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader eyebrow="Eco-Marketplace" title="Verified compost, fertiliser and feed" />
            <Button asChild variant="outline" className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 shrink-0">
              <Link to="/marketplace">View all products <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }}>
                  <ProductCard {...p} />
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── IoT Monitoring ── */}
      <section className="relative z-10 py-28 px-6 border-t border-white/5 bg-gradient-to-b from-emerald-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Operational visibility" title="Live IoT Sensor Monitoring" subtitle="Continuous sensor data streams from every composter unit in the network." />
          <div className="grid lg:grid-cols-3 gap-5 mt-14">
            {IOT_UNITS.map((u, i) => (
              <FadeUp key={u.name} delay={i * 0.1}>
                <IoTUnitCard {...u} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning ── */}
      <section id="learning" className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader eyebrow="Learning Platform" title="Waste management training & certifications" />
            <Button asChild variant="outline" className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 shrink-0">
              <Link to="/dashboard/learner">Browse courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {COURSES.map((c, i) => (
              <FadeUp key={c.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }}>
                  <CourseCard {...c} />
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ── */}
      <section className="relative z-10 py-28 px-6 border-t border-white/5 overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-teal-950/40 to-transparent" />
        <div className="absolute inset-0 border border-emerald-500/10 m-6 rounded-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
            <SectionHeader eyebrow="Environmental impact" title="Real numbers, measurable change." light />
            <div className="flex items-center gap-3 text-sm text-emerald-400/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Updated in real time
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <motion.div
                  className="group rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-4">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    <AnimatedCounter value={s.value} />{s.unit && <span className="text-xl font-bold text-white/40 ml-1">{s.unit}</span>}
                  </p>
                  <p className="text-sm text-white/50 mt-2">{s.label}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="plans" className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Subscription plans" title="For Bio-Processors" subtitle="Start free, scale with Premium. No hidden fees, no lock-in." />
          <div className="grid md:grid-cols-2 gap-6 mt-14 max-w-3xl">
            <PlanCard
              name="Free"
              price="KES 0"
              description="For small operators getting started."
              features={[
                { label: "Pickup request feed", on: true },
                { label: "Manual unit logging", on: true },
                { label: "Basic marketplace listing (3 products)", on: true },
                { label: "Real-time IoT sensor data", on: false },
                { label: "Priority pickup matching", on: false },
                { label: "Premium analytics & reports", on: false },
              ]}
            />
            <PlanCard
              name="Premium"
              price="KES 8,500"
              description="Per month. Full ecosystem access."
              highlighted
              features={[
                { label: "Pickup request feed", on: true },
                { label: "Real-time IoT sensor data", on: true },
                { label: "Priority pickup matching", on: true },
                { label: "Unlimited marketplace listings", on: true },
                { label: "Premium analytics & reports", on: true },
                { label: "Dedicated support", on: true },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <motion.div
              className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 p-12 overflow-hidden"
              whileHover={{ borderColor: "rgba(16,185,129,0.35)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                  <Leaf className="h-3.5 w-3.5" /> Join the movement
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Ready to transform<br />your waste operation?
                </h2>
                <p className="text-white/50 mb-8 max-w-lg mx-auto">
                  Join 3,200+ producers, processors and farmers already building Africa's circular economy.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-8 shadow-2xl shadow-emerald-500/30">
                    <Link to="/register">Start for Free <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/15 text-white hover:bg-white/5 h-12 px-8">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-white/40 max-w-xs leading-relaxed">
              SMACOM Solutions powers Africa's circular waste economy with intelligent infrastructure and a transparent marketplace.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a key={s} href="#" className="h-9 w-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Product" links={[["How it works", "#how"], ["Marketplace", "#marketplace"], ["Learning", "#learning"], ["IoT Monitoring", "#"]]} />
          <FooterCol title="Company" links={[["About", "#"], ["Blog", "#"], ["Careers", "#"], ["Contact", "#"]]} />
          <FooterCol title="Legal" links={[["Privacy", "#"], ["Terms", "#"], ["Security", "#"], ["Login", "/login"]]} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">© 2026 SMACOM Solutions. All rights reserved.</p>
          <p className="text-xs text-white/25">Powering Africa's circular economy 🌿</p>
        </div>
      </footer>

      {/* ── Mobile Bottom Nav ── */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-2xl px-2 py-2 flex items-center justify-around">
          {MOBILE_NAV.map(({ icon: Icon, label, href }, idx) => (
            <a
              key={label}
              href={href}
              onClick={() => setActiveMobileTab(idx)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${activeMobileTab === idx ? "bg-emerald-500/20 text-emerald-400" : "text-white/35 hover:text-white/70"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}

/* ─── Footer Col ─────────────────────────────────────────── */

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-bold text-white mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-white/40 hover:text-white/80 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Plan Card ──────────────────────────────────────────── */

function PlanCard({ name, price, description, features, highlighted }: {
  name: string; price: string; description: string;
  features: { label: string; on: boolean }[];
  highlighted?: boolean;
}) {
  return (
    <FadeUp>
      <motion.div
        className={`relative rounded-2xl border p-7 transition-all duration-300 ${highlighted ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-teal-950/30" : "border-white/8 bg-white/3"}`}
        whileHover={{ y: -4, boxShadow: highlighted ? "0 30px 80px rgba(16,185,129,0.15)" : "0 20px 40px rgba(0,0,0,0.3)" }}
      >
        {highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-[10px] font-bold rounded-full bg-emerald-500 text-black px-3 py-1 uppercase tracking-wider shadow-lg">
              Most Popular
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-black text-white">{name}</h3>
        </div>
        <p className="text-4xl font-black text-white tracking-tight mt-3">{price}</p>
        <p className="text-sm text-white/40 mt-1.5">{description}</p>
        <ul className="mt-7 space-y-3">
          {features.map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-sm">
              {f.on
                ? <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                : <X className="h-4 w-4 text-white/20 shrink-0" />
              }
              <span className={f.on ? "text-white/80" : "text-white/30"}>{f.label}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full mt-8 h-11 font-bold ${highlighted ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25" : "border border-white/10 text-white/70 hover:text-white hover:bg-white/5 bg-transparent"}`}
        >
          Choose {name}
        </Button>
      </motion.div>
    </FadeUp>
  );
}