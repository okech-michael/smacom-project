import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/smacom/Logo";
import { ProductCard } from "@/components/smacom/ProductCard";
import { CourseCard } from "@/components/smacom/CourseCard";
import { IoTUnitCard } from "@/components/smacom/IoTUnitCard";
import { ROLES, PRODUCTS, COURSES, IOT_UNITS } from "@/lib/mock-data";
import {
  ArrowRight, ClipboardCheck, Camera, Truck, ShoppingCart, BookOpen, Activity,
  Radio, MapPin, Sparkles, Store, Check, X,
} from "lucide-react";

const STEPS = [
  { icon: ClipboardCheck, title: "Register & verify", desc: "Create an account and complete verification." },
  { icon: Camera, title: "Log waste", desc: "Producers upload photo and pin location." },
  { icon: Truck, title: "Pickup", desc: "Bio-Processor accepts and collects waste." },
  { icon: ShoppingCart, title: "Marketplace", desc: "Farmers buy compost and fertiliser." },
  { icon: BookOpen, title: "Learn", desc: "Learners enrol in waste training." },
  { icon: Activity, title: "Monitor", desc: "Admins track every metric in real time." },
];

const FEATURES = [
  { icon: Radio, title: "Real-Time IoT Monitoring", desc: "Sensors stream temperature, moisture and CO₂ data continuously." },
  { icon: MapPin, title: "GPS-Based Waste Matching", desc: "Pickup requests routed to the nearest verified processor." },
  { icon: Camera, title: "Waste Photo Uploads", desc: "Quality and contamination flagged at submission." },
  { icon: Sparkles, title: "AI Soil Recommendations", desc: "Tailored compost suggestions per soil sample and crop." },
  { icon: Store, title: "Eco-Marketplace", desc: "Verified buyers and sellers with built-in escrow." },
  { icon: BookOpen, title: "Integrated Learning", desc: "Courses and certifications for the whole ecosystem." },
];

const IMPACT = [
  { value: "1,240", unit: "MT", label: "Waste Diverted" },
  { value: "620", unit: "Tonnes", label: "CO₂ Saved" },
  { value: "480", unit: "MT", label: "Compost Produced" },
  { value: "3,200", unit: "", label: "Registered Users" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#roles" className="hover:text-foreground">Who it's for</a>
            <a href="#marketplace" className="hover:text-foreground">Marketplace</a>
            <a href="#learning" className="hover:text-foreground">Learning</a>
            <a href="#plans" className="hover:text-foreground">Plans</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
            <Button asChild size="sm"><Link to="/register">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container-page py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Waste-to-Wealth System
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Turn Organic Waste<br /> Into <span className="text-primary">Wealth</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              SMACOM connects waste producers, bio-processors and farmers in one intelligent platform — powered by IoT sensors, AI recommendations and a live marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero">
                <Link to="/register">Get Started <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="hero-outline">
                <a href="#how">See How It Works</a>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
            <Card className="relative p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">Live Composter Feed</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
                </span>
              </div>
              <IoTUnitCard {...IOT_UNITS[0]} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {IMPACT.slice(0, 3).map((s) => (
                  <div key={s.label} className="rounded-md border border-border p-3">
                    <p className="text-lg font-bold">{s.value}<span className="text-xs font-medium text-muted-foreground ml-1">{s.unit}</span></p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="container-page py-16 border-t border-border">
        <SectionHeader eyebrow="How it works" title="From waste to wealth in six steps" />
        <div className="grid lg:grid-cols-6 gap-4 mt-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative flex lg:flex-col gap-4">
              <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground border border-border">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">Step {i + 1}</p>
                <h3 className="font-semibold leading-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="container-page py-16 border-t border-border">
        <SectionHeader eyebrow="Built for everyone" title="Who is SMACOM for?" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {ROLES.map((r) => (
            <Card key={r.id} className="p-6 shadow-sm hover:shadow-md transition">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{r.desc}</p>
              <Link to={r.path} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/40 border-y border-border py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Platform" title="Everything you need to run a circular operation" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground mb-3">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section id="marketplace" className="container-page py-16">
        <SectionHeader eyebrow="The Eco-Marketplace" title="Verified compost, fertiliser and feed" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {PRODUCTS.slice(0, 4).map((p) => (<ProductCard key={p.name} {...p} />))}
        </div>
      </section>

      {/* IoT preview */}
      <section className="bg-secondary/40 border-y border-border py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Operational visibility" title="Live IoT Sensor Monitoring" />
          <div className="grid lg:grid-cols-3 gap-5 mt-10">
            {IOT_UNITS.map((u) => (<IoTUnitCard key={u.name} {...u} />))}
          </div>
        </div>
      </section>

      {/* Learning preview */}
      <section id="learning" className="container-page py-16">
        <SectionHeader eyebrow="Learning Platform" title="Waste management training" />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {COURSES.map((c) => (<CourseCard key={c.title} {...c} />))}
        </div>
      </section>

      {/* Impact */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Environmental impact</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Real numbers, measurable change.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT.map((s) => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {s.value}{s.unit && <span className="text-xl font-bold opacity-80 ml-1">{s.unit}</span>}
                </p>
                <p className="text-sm opacity-90 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="container-page py-16">
        <SectionHeader eyebrow="Subscription plans" title="For Bio-Processors" />
        <div className="grid md:grid-cols-2 gap-5 mt-10 max-w-4xl mx-auto">
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
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container-page py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              SMACOM Solutions powers Africa's circular waste economy with intelligent infrastructure and a transparent marketplace.
            </p>
          </div>
          <FooterCol title="Product" links={[["How it works","#how"],["Marketplace","#marketplace"],["Learning","#learning"]]} />
          <FooterCol title="Company" links={[["About","#"],["Contact","#"],["Login","/login"]]} />
        </div>
        <div className="container-page py-6 border-t border-border text-xs text-muted-foreground">
          © 2026 SMACOM Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-semibold mb-3">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}><Link to={href} className="hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function PlanCard({ name, price, description, features, highlighted }: { name: string; price: string; description: string; features: { label: string; on: boolean }[]; highlighted?: boolean }) {
  return (
    <Card className={`p-6 shadow-sm ${highlighted ? "border-primary ring-1 ring-primary" : ""}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold">{name}</h3>
        {highlighted && <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2.5 py-0.5">Most popular</span>}
      </div>
      <p className="text-3xl font-extrabold tracking-tight mt-2">{price}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f.label} className="flex items-start gap-2 text-sm">
            {f.on ? <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> : <X className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
            <span className={f.on ? "" : "text-muted-foreground"}>{f.label}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full mt-6" variant={highlighted ? "default" : "outline"}>Choose {name}</Button>
    </Card>
  );
}
