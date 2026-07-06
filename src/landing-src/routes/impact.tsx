import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import impact from "@/assets/impact.jpg";
import farmers from "@/assets/farmers.jpg";
import community from "@/assets/community.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact | SMACOM Solutions" },
      {
        name: "description",
        content:
          "SMACOM Solutions publishes verified impact numbers: CO2 avoided, waste diverted, farmers supported, communities served, and training delivered.",
      },
      { property: "og:title", content: "SMACOM Impact" },
      {
        property: "og:description",
        content: "Verified, transparent progress against the circular economy.",
      },
    ],
  }),
  component: Impact,
});

const HEADLINE_STATS = [
  { v: "840K", l: "Tons CO\u2082 equivalent avoided", d: "Verified using an independent GHG methodology." },
  { v: "1.2M", l: "Tons of organic waste diverted", d: "From landfills into productive bio-processing." },
  { v: "52K+", l: "Farmers actively supported", d: "Sourcing certified bio-inputs at fair prices." },
  { v: "180+", l: "Communities served", d: "Neighborhoods with active organics collection." },
  { v: "3.5K", l: "Operators and learners trained", d: "Certified via the SMACOM Learning Hub." },
  { v: "38", l: "Processing facilities integrated", d: "Running on SMACOM-OS with full audit trails." },
];

const TIMELINE_MILESTONES = [
  { year: "2022", h: "First 100k tons diverted", d: "The platform crosses a symbolic operational threshold." },
  { year: "2023", h: "First carbon program verified", d: "Independent verification of a nature-based avoidance pathway." },
  { year: "2024", h: "10,000 farmers on marketplace", d: "The marketplace reaches five-figure active users." },
  { year: "2025", h: "First regional expansion", d: "Second regional hub goes live with municipal partners." },
  { year: "2026", h: "1M ton milestone", d: "Cumulative organic waste diverted crosses one million tons." },
];

const STORIES = [
  {
    tag: "Farmer",
    title: "Doubling maize yield without synthetic fertilizer",
    quote:
      "In two seasons using SMACOM bio-fertilizer, my yield went from 12 to 24 bags per acre. My soil holds water again.",
    name: "Rebecca N., Nakuru",
    img: farmers,
  },
  {
    tag: "Municipality",
    title: "Cutting landfill volume by more than half",
    quote:
      "Working with SMACOM, we cut organic landfill volume by 58% in eighteen months and freed capacity for a decade.",
    name: "City of Kisumu, Waste Directorate",
    img: community,
  },
  {
    tag: "Corporate",
    title: "A hotel group that pays for itself",
    quote:
      "Between avoided landfill fees and organic input sales, our waste program is now a positive contributor to the P&L.",
    name: "Lakeside Hotel Group",
    img: impact,
  },
];

function Impact() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title={<>Transparent progress. Verified outcomes.</>}
        description="SMACOM publishes its impact against a public methodology because circular claims are only meaningful when they can be measured, audited, and improved."
        image={impact}
        imageAlt="Restored landscape at sunrise"
      />

      {/* Headline stats */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEADLINE_STATS.map((s) => (
              <div
                key={s.l}
                className="p-8 rounded-3xl bg-slate-50 ring-1 ring-slate-200"
              >
                <div className="text-5xl md:text-6xl font-bold text-forest font-display">
                  {s.v}
                </div>
                <div className="mt-3 font-semibold text-slate-900">{s.l}</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart placeholder */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Waste diverted over time
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 font-display text-balance">
              A steepening curve, year after year.
            </h2>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-8">
            <BarChart />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Impact timeline
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 font-display text-balance">
              Key milestones on the way to 1M tons diverted.
            </h2>
          </div>
          <ol className="relative border-l-2 border-slate-200 pl-8 space-y-10">
            {TIMELINE_MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[41px] top-1 grid size-6 place-items-center rounded-full bg-forest ring-4 ring-white">
                  <span className="size-2 rounded-full bg-spring" />
                </span>
                <div className="text-sm font-bold tracking-widest text-spring">
                  {m.year}
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-900 font-display">
                  {m.h}
                </h3>
                <p className="mt-1 text-slate-600 leading-relaxed">{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Success stories */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Success stories
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Impact you can hear in the first person.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STORIES.map((s) => (
              <article
                key={s.title}
                className="rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-spring">
                    {s.tag}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 font-display leading-snug">
                    {s.title}
                  </h3>
                  <blockquote className="mt-3 text-slate-600 leading-relaxed">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 text-sm font-semibold text-slate-700">
                    {s.name}
                  </div>
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

// Compact SVG bar chart. Values are illustrative but stable across renders.
function BarChart() {
  const bars = [
    { y: "2020", v: 40 },
    { y: "2021", v: 95 },
    { y: "2022", v: 180 },
    { y: "2023", v: 320 },
    { y: "2024", v: 540 },
    { y: "2025", v: 820 },
    { y: "2026", v: 1200 },
  ];
  const max = Math.max(...bars.map((b) => b.v));
  return (
    <div>
      <div className="flex items-end gap-4 h-56 md:h-72">
        {bars.map((b) => {
          const h = (b.v / max) * 100;
          return (
            <div key={b.y} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex justify-center text-xs font-semibold text-forest">
                {b.v}
              </div>
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-forest to-spring transition-all"
                style={{ height: `${h}%` }}
              />
              <div className="text-xs text-slate-500">{b.y}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Cumulative tons of organic waste diverted, in thousands.
      </div>
    </div>
  );
}
