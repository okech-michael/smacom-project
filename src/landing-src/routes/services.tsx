import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  GraduationCap,
  Lightbulb,
  Microscope,
  Wind,
  Cpu,
  ShoppingBag,
  Handshake,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import bioProcessing from "@/assets/bio-processing.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | SMACOM Solutions" },
      {
        name: "description",
        content:
          "Waste management, training, consulting, research, technology deployment, marketplace, and partnership services from SMACOM Solutions.",
      },
      { property: "og:title", content: "SMACOM Services" },
      {
        property: "og:description",
        content: "Professional services that plug your organization into the circular economy.",
      },
    ],
  }),
  component: Services,
});

const SERVICES = [
  {
    icon: Truck,
    title: "Waste Management",
    overview:
      "Full-service organics collection, sorting, and processing operated under SMACOM performance standards.",
    benefits: [
      "Guaranteed diversion rates",
      "Digital chain-of-custody",
      "Automated compliance reporting",
    ],
    who: "Cities, campuses, hospitality groups",
  },
  {
    icon: GraduationCap,
    title: "Training",
    overview:
      "Accredited technical training for waste operators, agronomists, and community champions on the SMACOM Learning platform.",
    benefits: [
      "In-person and blended cohorts",
      "Practical field assessments",
      "Recognized certifications",
    ],
    who: "Operators, cooperatives, government agencies",
  },
  {
    icon: Lightbulb,
    title: "Consulting",
    overview:
      "Strategic advisory on circular economy design, business models, funding structures, and public-private program architecture.",
    benefits: [
      "Fit-for-context strategy",
      "Financial modeling and unit economics",
      "Stakeholder facilitation",
    ],
    who: "Governments, corporates, funders, NGOs",
  },
  {
    icon: Microscope,
    title: "Research",
    overview:
      "Applied research on organic waste chemistry, nutrient recovery, soil health outcomes, and program-level environmental impact.",
    benefits: [
      "Peer-reviewed methodology",
      "Field-tested at commercial scale",
      "Open data publication where possible",
    ],
    who: "Academic partners, funders, regulators",
  },
  {
    icon: Wind,
    title: "Environmental Monitoring",
    overview:
      "Deployment and management of continuous environmental monitoring across processing sites and farmland.",
    benefits: [
      "Real-time telemetry dashboards",
      "Regulatory-grade evidence",
      "Automated alerting",
    ],
    who: "Operators, regulators, ESG teams",
  },
  {
    icon: Cpu,
    title: "Technology Deployment",
    overview:
      "Rollout of the SMACOM-OS platform, IoT sensor networks, and role-based access across your organization.",
    benefits: [
      "Managed implementation",
      "Integration with existing ERPs",
      "Localized training and change management",
    ],
    who: "Enterprises, utilities, municipal networks",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace Enablement",
    overview:
      "Onboarding processors and farmers onto the Eco Marketplace, from listing setup to fulfillment orchestration.",
    benefits: [
      "Vetted buyer network",
      "Integrated payments and logistics",
      "Product quality certification",
    ],
    who: "Processors, cooperatives, distributors",
  },
  {
    icon: Handshake,
    title: "Partnership Programs",
    overview:
      "Multi-stakeholder programs that align cities, corporates, and communities around measurable outcomes.",
    benefits: [
      "Shared governance frameworks",
      "Blended financing support",
      "Independent impact verification",
    ],
    who: "Cities, corporates, development partners",
  },
  {
    icon: Headphones,
    title: "Support Services",
    overview:
      "Ongoing platform support, uptime monitoring, and operational optimization for every SMACOM customer.",
    benefits: [
      "24/7 platform monitoring",
      "Named account engineers",
      "Continuous improvement reviews",
    ],
    who: "All SMACOM customers",
  },
] as const;

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Professional services that make circularity operational.</>}
        description="Nine service lines designed to help your organization plan, build, and continuously improve every touchpoint of the organic waste value chain."
        image={bioProcessing}
        imageAlt="SMACOM facility team at work"
      />

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex flex-col p-8 rounded-3xl bg-white ring-1 ring-slate-200 hover:ring-forest/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-spring-soft/60 text-forest">
                  <Icon size={20} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 font-display">
                  {s.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {s.overview}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-spring" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">For:</span>{" "}
                  {s.who}
                </div>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-forest font-semibold hover:gap-3 transition-all"
                >
                  Talk to us <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
