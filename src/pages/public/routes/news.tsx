import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import bioProcessing from "@/assets/bio-processing.jpg";
import iotSensor from "@/assets/iot-sensor.jpg";
import community from "@/assets/community.jpg";
import farmers from "@/assets/farmers.jpg";
import marketplace from "@/assets/marketplace.jpg";
import learning from "@/assets/learning.jpg";
import impact from "@/assets/impact.jpg";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Blog | SMACOM Solutions" },
      {
        name: "description",
        content:
          "Latest announcements, research, and stories from across the SMACOM Solutions ecosystem.",
      },
      { property: "og:title", content: "SMACOM News and Blog" },
      {
        property: "og:description",
        content: "Announcements, field notes, and research from the SMACOM network.",
      },
    ],
  }),
  component: News,
});

const CATEGORIES = ["All", "Announcements", "Research", "Impact", "Events", "Community"];

const FEATURED = {
  tag: "Announcement",
  date: "March 12, 2026",
  title: "SMACOM opens flagship bio-processing facility in Kisumu",
  excerpt:
    "The new plant will divert 40,000 tons of organic waste annually and supply 12,000 farmers with certified bio-fertilizer under a public-private operating agreement.",
  img: bioProcessing,
};

const POSTS = [
  { tag: "Research", date: "February 28, 2026", title: "How IoT telemetry raised compost quality by 32%", excerpt: "A multi-site field study reveals how sensor loops optimize aeration, moisture, and microbial activity.", img: iotSensor },
  { tag: "Impact", date: "February 4, 2026", title: "Community collection pilot delivers first carbon credits", excerpt: "Our neighborhood collection model in Nairobi has been verified for high-integrity nature-based removals.", img: community },
  { tag: "Community", date: "January 22, 2026", title: "Rift Valley cooperative crosses 12,000 members", excerpt: "One of Africa's largest farmer cooperatives now sources bio-inputs through the SMACOM marketplace.", img: farmers },
  { tag: "Events", date: "January 8, 2026", title: "SMACOM keynotes the East Africa Circular Summit", excerpt: "Our CEO shares three principles for building infrastructure that outlasts a funding cycle.", img: impact },
  { tag: "Announcement", date: "December 18, 2025", title: "New bio-based feed product enters commercial supply", excerpt: "A tested protein feed for poultry and aquaculture is now available across three regions.", img: marketplace },
  { tag: "Research", date: "November 30, 2025", title: "Field guide: preventing pathogen risk in compost", excerpt: "A practical, peer-reviewed guide for facility operators to keep pathogens out of finished compost.", img: learning },
];

function News() {
  return (
    <>
      <PageHero
        eyebrow="News & Blog"
        title={<>Announcements, research, and stories from the network.</>}
        description="What we&apos;re shipping, what we&apos;re learning in the field, and what the wider SMACOM community is building."
      />

      {/* Search + categories */}
      <section className="py-8 md:py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search articles"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-50 ring-1 ring-slate-200 focus:ring-forest focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  i === 0
                    ? "bg-forest text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <article className="grid lg:grid-cols-2 rounded-[36px] overflow-hidden bg-slate-50 ring-1 ring-slate-200 group">
            <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
              <img
                src={FEATURED.img}
                alt={FEATURED.title}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                <span className="text-spring">{FEATURED.tag}</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-500">{FEATURED.date}</span>
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 font-display leading-tight text-balance">
                {FEATURED.title}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {FEATURED.excerpt}
              </p>
              <a
                href="#"
                className="mt-6 inline-flex text-forest font-semibold hover:underline"
              >
                Read the announcement &rarr;
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((p) => (
              <article
                key={p.title}
                className="group bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200 hover:ring-forest/25 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-spring">{p.tag}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-500">{p.date}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 font-display leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {p.excerpt}
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
