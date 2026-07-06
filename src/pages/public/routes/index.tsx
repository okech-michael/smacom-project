import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  Truck,
  Factory,
  Cpu,
  ShoppingBag,
  Sprout,
  Globe2,
  ShieldCheck,
  LineChart,
  GraduationCap,
} from "lucide-react";
import heroAerial from "@/assets/hero-aerial.jpg";
import wasteCollection from "@/assets/waste-collection.jpg";
import bioProcessing from "@/assets/bio-processing.jpg";
import iotSensor from "@/assets/iot-sensor.jpg";
import analytics from "@/assets/analytics.jpg";
import farmers from "@/assets/farmers.jpg";
import marketplace from "@/assets/marketplace.jpg";
import community from "@/assets/community.jpg";
import { CtaBanner } from "@/components/cta-banner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "SMACOM Solutions | Turning Organic Waste into Sustainable Wealth",
      },
      {
        name: "description",
        content:
          "SMACOM Solutions integrates smart waste collection, bio-processing, IoT monitoring, an eco marketplace, and learning to build the circular economy of tomorrow.",
      },
      {
        property: "og:title",
        content: "SMACOM Solutions | Sustainable Wealth from Organic Waste",
      },
      {
        property: "og:description",
        content:
          "Climate-tech infrastructure connecting waste producers, processors, farmers, and learners.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { value: "1.2M", label: "Tons of organic waste diverted" },
  { value: "840K", label: "Tons of CO\u2082 equivalent avoided" },
  { value: "52K+", label: "Farmers active on the network" },
  { value: "38", label: "Processing facilities integrated" },
];

const SOLUTIONS = [
  {
    n: "01",
    title: "Waste Producers",
    desc: "Digital tracking, scheduled collection, and impact reporting for hotels, markets, campuses, and municipalities.",
    img: wasteCollection,
    accent: "spring",
    href: "/solutions",
  },
  {
    n: "02",
    title: "Bio-Processors",
    desc: "Sensor-monitored composting and anaerobic digestion facilities engineered for optimal nutrient recovery.",
    img: bioProcessing,
    accent: "forest",
    href: "/solutions",
  },
  {
    n: "03",
    title: "Eco Marketplace",
    desc: "Direct-to-farmer distribution of premium bio-fertilizer, biochar, and animal feed produced from processed waste.",
    img: marketplace,
    accent: "clay",
    href: "/marketplace",
  },
];

const ECOSYSTEM = [
  { icon: Truck, label: "Waste Producer", desc: "Segregation at source" },
  { icon: Leaf, label: "Collection", desc: "Smart route logistics" },
  { icon: Factory, label: "Bio-Processor", desc: "Nutrient recovery" },
  { icon: Cpu, label: "IoT Monitoring", desc: "Real-time telemetry" },
  { icon: ShoppingBag, label: "Marketplace", desc: "Fair-price distribution" },
  { icon: Sprout, label: "Farmer", desc: "Regenerative growth" },
  { icon: Globe2, label: "Impact", desc: "Verified carbon reduction" },
];

const TESTIMONIALS = [
  {
    quote:
      "SMACOM turned our kitchen waste liability into a revenue line. Their IoT dashboards make sustainability reporting effortless for our sixty properties.",
    name: "Amina Okoye",
    role: "Head of Sustainability, Lakeside Hotel Group",
  },
  {
    quote:
      "The bio-fertilizer we source through the marketplace has lifted our yields measurably. Our soil is genuinely healthier than it was three seasons ago.",
    name: "Joseph Mwangi",
    role: "Farmer, Rift Valley Cooperative",
  },
  {
    quote:
      "As a municipality we need traceability. The SMACOM platform gives us line-of-sight from bin to farm, with the audit trail our regulators expect.",
    name: "Dr. Elena Rossi",
    role: "Waste Director, City of Genova",
  },
];

const PARTNERS = [
  "MinAgri",
  "UNEP",
  "GreenTech",
  "AgriBank",
  "EcoCert",
  "OpenClimate",
];

const NEWS = [
  {
    tag: "Announcement",
    date: "March 12, 2026",
    title: "SMACOM opens flagship bio-processing facility in Kisumu",
    excerpt:
      "The new plant will divert 40,000 tons of organic waste annually and supply 12,000 farmers with certified bio-fertilizer.",
    img: bioProcessing,
  },
  {
    tag: "Research",
    date: "February 28, 2026",
    title: "How IoT telemetry raised compost quality by 32%",
    excerpt:
      "A field study across eight processing sites shows how real-time sensor loops optimize aeration and microbial activity.",
    img: iotSensor,
  },
  {
    tag: "Impact",
    date: "February 4, 2026",
    title: "Community collection pilot delivers first carbon credits",
    excerpt:
      "Our neighborhood collection model in Nairobi has been verified for high-quality nature-based carbon removal.",
    img: community,
  },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 600px at 15% 0%, color-mix(in oklab, var(--spring) 14%, transparent), transparent 60%), radial-gradient(900px 500px at 100% 0%, color-mix(in oklab, var(--sky) 90%, transparent), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spring/10 text-forest text-[11px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-spring opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-spring" />
              </span>
              Climate-tech for the circular economy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.02] text-balance font-display">
              Turning Organic Waste into{" "}
              <span className="text-forest">Sustainable Wealth.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              SMACOM Solutions unites waste producers, bio-processors, and
              farmers in one intelligent platform, converting the world&apos;s
              organic surplus into regenerative agricultural value.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 px-7 py-4 bg-forest text-white font-semibold rounded-2xl hover:bg-forest-deep transition-colors shadow-xl shadow-forest/15"
              >
                Explore Solutions <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 border border-slate-200 text-slate-900 font-semibold rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[40px] shadow-2xl outline outline-1 -outline-offset-1 outline-black/5">
              <img
                src={heroAerial}
                alt="Aerial view of a circular organic farm and bio-processing facility"
                width={1600}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-6 md:-left-10 bg-white/95 backdrop-blur-md p-6 md:p-7 rounded-2xl shadow-2xl border border-slate-100 max-w-[260px]">
              <div className="text-4xl font-bold text-forest font-display">
                140k+
              </div>
              <div className="mt-1 text-sm text-slate-500 font-medium leading-snug">
                Tons of waste diverted from landfills this year alone.
              </div>
            </div>
            <div className="absolute -top-6 -right-4 md:-right-8 bg-forest text-white p-5 rounded-2xl shadow-xl max-w-[220px]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-spring">
                <span className="size-2 rounded-full bg-spring animate-pulse" />
                Live IoT
              </div>
              <div className="mt-2 text-sm font-medium leading-snug">
                Processing 4.2 tons of organic matter per hour at Site A.
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-24 md:mt-32 max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-bold text-forest font-display">
                  {s.value}
                </div>
                <div className="mt-1.5 text-sm text-slate-500 font-medium leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Our Mission
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display leading-tight text-balance">
              A regenerative economy, built from the ground up.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              Every year, more than a billion tons of organic material end up
              in landfills, releasing methane and starving soils of the
              nutrients they need. SMACOM exists to redirect that flow &mdash;
              turning what was once a burden into an engine for prosperity.
            </p>
            <p>
              Through smart collection, high-integrity processing, verifiable
              impact, and a transparent marketplace, we make it commercially
              obvious to close the organic loop. The result is cleaner cities,
              healthier soils, better livelihoods, and a measurably lighter
              planet.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Solutions
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              A complete circular ecosystem.
            </h2>
            <p className="mt-5 text-lg text-slate-600 max-w-2xl">
              One integrated platform serving every stakeholder in the organic
              value chain, from the point of waste to the point of harvest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.title}
                to={s.href}
                className="group flex flex-col p-8 bg-white rounded-3xl border border-slate-200 hover:border-forest/30 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <div
                  className={`size-12 rounded-2xl grid place-items-center mb-6 font-bold text-lg font-display bg-${s.accent}/10 text-${s.accent === "spring" ? "forest" : s.accent}`}
                  style={{
                    background:
                      s.accent === "spring"
                        ? "color-mix(in oklab, var(--spring) 12%, transparent)"
                        : s.accent === "forest"
                          ? "color-mix(in oklab, var(--forest) 10%, transparent)"
                          : "color-mix(in oklab, var(--clay) 12%, transparent)",
                    color:
                      s.accent === "clay" ? "var(--clay)" : "var(--forest)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8">{s.desc}</p>
                <div className="mt-auto overflow-hidden rounded-xl aspect-[16/10]">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-forest font-semibold">
                  Learn more{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              How SMACOM Works
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              One loop. Seven touchpoints. Zero waste.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Follow a banana peel from a hotel kitchen in Nairobi to a maize
              field in Nakuru. Every step is measured, monetized, and
              regenerative.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-forest/25 to-transparent" />
            <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {ECOSYSTEM.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.label}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 grid size-16 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm text-forest">
                      <Icon size={22} />
                    </div>
                    <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-spring">
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {step.label}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 leading-snug">
                      {step.desc}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="py-24 md:py-32 bg-forest text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
                <img
                  src={iotSensor}
                  alt="IoT soil sensor in field"
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="pt-12">
                <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
                  <img
                    src={analytics}
                    alt="Environmental analytics dashboard"
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -left-10 size-40 rounded-full blur-3xl bg-spring/30" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Technology
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight font-display text-balance">
              Intelligence powered by nature and data.
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
              SMACOM-OS is the operating layer beneath every touchpoint. It
              blends IoT telemetry, machine learning, and secure role-based
              access into one coherent, auditable platform.
            </p>
            <div className="mt-10 space-y-6">
              {[
                {
                  icon: Cpu,
                  title: "IoT & Real-time Telemetry",
                  desc: "Distributed sensors track moisture, temperature, and nutrient levels across every batch.",
                },
                {
                  icon: LineChart,
                  title: "Predictive Analytics",
                  desc: "Machine learning models forecast waste generation and optimize collection routes.",
                },
                {
                  icon: ShieldCheck,
                  title: "Role-based Security",
                  desc: "Fine-grained permissions for producers, processors, farmers, learners, and administrators.",
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-5">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <Icon size={20} className="text-spring" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{f.title}</h4>
                      <p className="mt-1 text-white/60 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              to="/technology"
              className="mt-12 inline-flex items-center gap-2 px-7 py-4 bg-white text-forest font-semibold rounded-2xl hover:bg-spring-soft transition-colors"
            >
              Explore the platform <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-spring">
                Featured Projects
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
                Real programs, measurable outcomes.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:gap-3 transition-all"
            >
              View all projects <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                img: farmers,
                tag: "Farmer Network",
                title: "Rift Valley Cooperative",
                desc: "12,000 smallholders sourcing certified bio-fertilizer at fair, transparent prices.",
              },
              {
                img: community,
                tag: "Community",
                title: "Nairobi Neighborhood Collection",
                desc: "A door-to-door organics program serving 45,000 households across three sub-counties.",
              },
              {
                img: bioProcessing,
                tag: "Infrastructure",
                title: "Kisumu Flagship Facility",
                desc: "A 40,000-ton-per-year processing plant powered end-to-end by SMACOM-OS.",
              },
            ].map((p) => (
              <article
                key={p.title}
                className="group overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-slate-200 hover:ring-forest/20 transition-all"
              >
                <div className="aspect-[16/11] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-spring">
                    {p.tag}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 font-display">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-spring-soft/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Trusted by operators across the value chain.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="bg-white rounded-3xl p-8 ring-1 ring-slate-200 shadow-sm"
              >
                <div className="text-spring text-5xl leading-none font-display">
                  &ldquo;
                </div>
                <blockquote className="mt-2 text-slate-700 leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 pt-6 border-t border-slate-100">
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-8">
            Working alongside
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="grid place-items-center h-14 rounded-xl bg-slate-50 text-slate-500 font-semibold tracking-wide"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS PREVIEW */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-spring">
                Latest News
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
                What we&apos;re building and learning.
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:gap-3 transition-all"
            >
              All stories <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {NEWS.map((n) => (
              <article
                key={n.title}
                className="group bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200 hover:ring-forest/20 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-spring">{n.tag}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-500">{n.date}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-slate-900 font-display leading-snug">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {n.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING TEASER */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Learning Platform
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Grow the people who grow the future.
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              The SMACOM Learning platform equips operators, farmers, and
              students with practical, accredited training in circular waste
              management and regenerative agriculture.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { icon: GraduationCap, label: "Certified courses" },
                { icon: LineChart, label: "Progress tracking" },
                { icon: ShieldCheck, label: "Expert instructors" },
                { icon: Globe2, label: "Community learning" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-white ring-1 ring-slate-200 text-forest">
                      <Icon size={16} />
                    </div>
                    <span className="font-medium text-slate-800">
                      {f.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link
              to="/learning"
              className="mt-10 inline-flex items-center gap-2 px-7 py-4 bg-forest text-white font-semibold rounded-2xl hover:bg-forest-deep transition-colors"
            >
              Visit Learning Hub <ArrowRight size={18} />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[36px] shadow-xl ring-1 ring-black/5">
              <img
                src={farmers}
                alt="Farmers learning field techniques"
                loading="lazy"
                className="w-full aspect-[5/4] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
