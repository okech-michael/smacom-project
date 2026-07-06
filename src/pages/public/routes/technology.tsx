import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  Cpu,
  Cloud,
  MapPin,
  BarChart3,
  Wind,
  Zap,
  Bell,
  ShieldCheck,
  Lock,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import iotSensor from "@/assets/iot-sensor.jpg";
import analytics from "@/assets/analytics.jpg";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology | SMACOM-OS Platform" },
      {
        name: "description",
        content:
          "SMACOM-OS is the operating system for the circular waste economy: AI, IoT, cloud, real-time analytics, secure role-based access, and integrated payments.",
      },
      { property: "og:title", content: "SMACOM Technology" },
      {
        property: "og:description",
        content:
          "The platform, sensors, and intelligence that power every SMACOM engagement.",
      },
    ],
  }),
  component: Technology,
});

const TECH = [
  { icon: Brain, title: "Artificial Intelligence", desc: "Applied AI models classify waste streams, forecast generation cycles, and recommend processing pathways in real time." },
  { icon: Sparkles, title: "Machine Learning", desc: "Continuously improving models optimize nutrient recovery, compost quality, and route logistics from live field data." },
  { icon: Cpu, title: "IoT Sensor Networks", desc: "Distributed sensors track moisture, temperature, oxygen, methane, and load weight across every facility and vehicle." },
  { icon: Cloud, title: "Cloud Infrastructure", desc: "A resilient, multi-region cloud backbone with edge caching keeps operations responsive even in low-connectivity regions." },
  { icon: MapPin, title: "GPS Tracking", desc: "Every collection vehicle and shipment is geolocated in real time, powering route optimization and audit-ready evidence." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Streaming dashboards give operators and customers moment-to-moment visibility on tons processed and impact created." },
  { icon: Wind, title: "Environmental Monitoring", desc: "Ambient air, water, and soil monitoring around every facility, with automated compliance reports for regulators." },
  { icon: Zap, title: "Process Automation", desc: "Workflow engines eliminate paperwork across scheduling, weighbridge intake, quality assays, and invoicing." },
  { icon: Bell, title: "Smart Notifications", desc: "Context-aware alerts reach the right operator, farmer, or administrator by SMS, app, and email." },
  { icon: ShieldCheck, title: "Role-based Systems", desc: "Fine-grained permissions for waste producers, bio-processors, farmers, learners, and administrators." },
  { icon: Lock, title: "Secure Authentication", desc: "Multi-factor authentication, session controls, and full audit trails across every user action." },
  { icon: CreditCard, title: "Payment Integration", desc: "Mobile money, bank rails, and wallet payouts settle every transaction across the marketplace transparently." },
] as const;

function Technology() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title={<>SMACOM-OS: the operating system for the circular economy.</>}
        description="A single, coherent platform that unifies sensors, models, dashboards, workflows, security, and payments &mdash; so every touchpoint in the loop is fast, safe, and measurable."
        image={analytics}
        imageAlt="SMACOM-OS analytics dashboard"
      />

      {/* Feature grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Platform capabilities
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Twelve technologies. One coherent platform.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {TECH.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="group p-7 rounded-3xl bg-slate-50 ring-1 ring-slate-200 hover:bg-white hover:ring-forest/25 hover:shadow-lg transition-all"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-slate-200 text-forest group-hover:bg-forest group-hover:text-white transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 font-display">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="py-24 md:py-32 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Architecture
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold font-display text-balance">
              Sensor to soil, in five layers.
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { name: "Edge Layer", desc: "IoT sensors, weighbridges, GPS trackers, mobile capture apps.", tint: "bg-white/[0.04]" },
              { name: "Data Layer", desc: "Streaming ingestion, cleaned data lake, transactional ledger of every ton.", tint: "bg-white/[0.06]" },
              { name: "Intelligence Layer", desc: "AI models for classification, forecasting, quality prediction, and impact accounting.", tint: "bg-white/[0.08]" },
              { name: "Application Layer", desc: "Role-based apps for producers, processors, farmers, learners, and administrators.", tint: "bg-white/[0.10]" },
              { name: "Trust Layer", desc: "Verification, compliance reporting, payments, carbon credit issuance and audit trail.", tint: "bg-white/[0.14]" },
            ].map((l, i) => (
              <div
                key={l.name}
                className={`rounded-2xl p-6 md:p-8 ring-1 ring-white/10 ${l.tint} grid md:grid-cols-[auto_1fr_auto] items-center gap-6`}
              >
                <div className="text-[11px] font-bold uppercase tracking-widest text-spring">
                  Layer {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="text-xl font-bold font-display">{l.name}</div>
                  <div className="mt-1 text-white/70 text-sm">{l.desc}</div>
                </div>
                <div className="hidden md:block text-white/30 text-xs font-mono">
                  {"//"} layer {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split highlight */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="overflow-hidden rounded-[36px] shadow-xl ring-1 ring-black/5">
            <img
              src={iotSensor}
              alt="Field-installed IoT sensor"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Built for the field
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Ruggedized hardware. Elegant software.
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Our sensor packages are designed for dust, heat, humidity, and
              the realities of everyday operation. The software layer above
              them is designed for people who have five minutes and one hand
              free, not a data scientist behind a desk.
            </p>
            <ul className="mt-8 space-y-3 text-slate-700">
              {[
                "Solar-optional sensor nodes with multi-year field lifetime",
                "Offline-first mobile capture with automatic sync",
                "Low-bandwidth dashboards that stay usable on 3G",
                "Open APIs for enterprise system integration",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-spring" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
