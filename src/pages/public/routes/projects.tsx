import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import bioProcessing from "@/assets/bio-processing.jpg";
import community from "@/assets/community.jpg";
import farmers from "@/assets/farmers.jpg";
import wasteCollection from "@/assets/waste-collection.jpg";
import impact from "@/assets/impact.jpg";
import iotSensor from "@/assets/iot-sensor.jpg";
import learning from "@/assets/learning.jpg";
import marketplace from "@/assets/marketplace.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | SMACOM Solutions" },
      {
        name: "description",
        content:
          "Community programs, environmental initiatives, farmer partnerships, and research projects delivered by SMACOM Solutions.",
      },
      { property: "og:title", content: "SMACOM Projects and Case Studies" },
      {
        property: "og:description",
        content:
          "Live programs turning circular ambition into measurable outcomes.",
      },
    ],
  }),
  component: Projects,
});

const FEATURED = {
  tag: "Case Study",
  title: "Kisumu Flagship Bio-Processing Facility",
  desc: "A 40,000-ton-per-year facility co-designed with the county government, financed through a blended structure, and operated end-to-end on SMACOM-OS. In its first year, it diverted 92% of accepted organics and supplied 12,000 farmers with certified bio-fertilizer.",
  img: bioProcessing,
  stats: [
    { v: "40k", l: "Tons / year" },
    { v: "92%", l: "Diversion rate" },
    { v: "12k", l: "Farmers served" },
  ],
};

const PROJECTS = [
  {
    tag: "Community",
    title: "Nairobi Neighborhood Collection",
    desc: "Door-to-door organics collection serving 45,000 households across three sub-counties.",
    img: community,
  },
  {
    tag: "Farmer Network",
    title: "Rift Valley Cooperative Partnership",
    desc: "A 12,000-member cooperative sourcing certified bio-fertilizer at fair, transparent prices.",
    img: farmers,
  },
  {
    tag: "Environmental",
    title: "Coastal Watershed Restoration",
    desc: "Applying biochar and compost to degraded catchments to restore soil hydrology and biodiversity.",
    img: impact,
  },
  {
    tag: "Infrastructure",
    title: "Municipal Smart Bin Rollout",
    desc: "Rollout of 2,400 sensor-enabled organic collection points across a metropolitan area.",
    img: wasteCollection,
  },
  {
    tag: "Research",
    title: "IoT-Optimized Composting Study",
    desc: "Multi-site research quantifying how sensor loops improve compost quality by up to 32%.",
    img: iotSensor,
  },
  {
    tag: "Marketplace",
    title: "Regional Bio-Feed Program",
    desc: "Scaling bio-based animal feed supply to aquaculture and poultry producers.",
    img: marketplace,
  },
  {
    tag: "Innovation",
    title: "Carbon-Backed Financing Pilot",
    desc: "Piloting revenue-linked financing for processors using verified carbon outcomes.",
    img: analyticsImage(),
  },
  {
    tag: "Learning",
    title: "Nationwide Operator Training",
    desc: "A public-private training program certifying 3,500 waste operators over 18 months.",
    img: learning,
  },
];

// Small helper so the imports list stays tidy above.
function analyticsImage() {
  // Reuse the impact hero for the finance pilot as a supporting visual.
  return impact;
}

function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={<>Programs that turn ambition into measurable outcomes.</>}
        description="From neighborhood collection to regional infrastructure, every SMACOM project is designed for real communities and measured against transparent, verifiable metrics."
        image={community}
        imageAlt="Community project meeting under a tree"
      />

      {/* Featured */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[40px] overflow-hidden bg-slate-50 ring-1 ring-slate-200 grid lg:grid-cols-2">
            <div className="aspect-[4/3] lg:aspect-auto">
              <img
                src={FEATURED.img}
                alt={FEATURED.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-spring">
                {FEATURED.tag}
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 font-display leading-tight text-balance">
                {FEATURED.title}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {FEATURED.desc}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {FEATURED.stats.map((s) => (
                  <div
                    key={s.l}
                    className="p-4 rounded-2xl bg-white ring-1 ring-slate-200"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-forest font-display">
                      {s.v}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 font-medium">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Portfolio
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Live programs across the network.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((p) => (
              <article
                key={p.title}
                className="group rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200 hover:ring-forest/25 hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-spring">
                    {p.tag}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 font-display leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
