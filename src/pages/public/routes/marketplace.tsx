import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Coins } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import marketplace from "@/assets/marketplace.jpg";
import farmers from "@/assets/farmers.jpg";
import bioProcessing from "@/assets/bio-processing.jpg";
import iotSensor from "@/assets/iot-sensor.jpg";
import wasteCollection from "@/assets/waste-collection.jpg";
import community from "@/assets/community.jpg";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Eco Marketplace | SMACOM Solutions" },
      {
        name: "description",
        content:
          "The SMACOM Eco Marketplace connects certified organic producers with farmers: bio-fertilizer, biochar, animal feed, and eco packaging.",
      },
      { property: "og:title", content: "SMACOM Eco Marketplace" },
      {
        property: "og:description",
        content:
          "Verified circular products from waste to farm, delivered transparently.",
      },
    ],
  }),
  component: Marketplace,
});

const PRODUCTS = [
  {
    name: "Premium Compost",
    price: "From $18 / bag",
    desc: "Fully matured aerobic compost, laboratory-tested for pathogens and nutrient density.",
    use: "Field preparation, orchards, high-value horticulture",
    stock: "In stock across 4 regions",
    img: marketplace,
  },
  {
    name: "Liquid Bio-Fertilizer",
    price: "From $9 / litre",
    desc: "Balanced NPK liquid concentrate for drip irrigation and foliar application.",
    use: "Vegetables, greenhouse crops, coffee, tea",
    stock: "Ships within 3 days",
    img: iotSensor,
  },
  {
    name: "Activated Biochar",
    price: "From $28 / bag",
    desc: "Carbon-rich soil amendment that boosts water retention and long-term fertility.",
    use: "Degraded soils, tree nurseries, permaculture",
    stock: "In stock",
    img: bioProcessing,
  },
  {
    name: "Bio-Based Animal Feed",
    price: "From $22 / sack",
    desc: "Nutritionally balanced protein feed produced from qualified organic streams.",
    use: "Poultry, aquaculture, pigs",
    stock: "Regional availability",
    img: farmers,
  },
  {
    name: "Organic Farm Inputs",
    price: "Bundle pricing",
    desc: "Curated bundles of seeds, seedlings, and inoculants for regenerative rotations.",
    use: "Whole-farm circular transitions",
    stock: "Custom orders",
    img: community,
  },
  {
    name: "Eco Packaging",
    price: "From $0.30 / unit",
    desc: "Compostable packaging manufactured from residual bio-processing streams.",
    use: "Food service, retail brands, farm boxes",
    stock: "Bulk orders",
    img: wasteCollection,
  },
] as const;

function Marketplace() {
  return (
    <>
      <PageHero
        eyebrow="Eco Marketplace"
        title={<>From waste to farm, transparently priced.</>}
        description="The SMACOM Eco Marketplace connects certified circular products with the farmers and businesses that need them, backed by end-to-end traceability."
        image={marketplace}
        imageAlt="Premium bio-fertilizer and biochar packaging"
      />

      {/* How it works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified quality",
                desc: "Every batch is laboratory-tested and traceable back to the exact processing facility.",
              },
              {
                icon: Truck,
                title: "Integrated logistics",
                desc: "Ordering, dispatch, and delivery are managed inside SMACOM-OS with real-time tracking.",
              },
              {
                icon: Coins,
                title: "Fair pricing",
                desc: "Transparent pricing shares value with processors and keeps inputs affordable for farmers.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-8 rounded-3xl bg-slate-50 ring-1 ring-slate-200"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-slate-200 text-forest">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 font-display">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-spring">
                Featured products
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
                Circular inputs, ready to ship.
              </h2>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:gap-3 transition-all"
            >
              Request bulk pricing <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <article
                key={p.name}
                className="group flex flex-col rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200 hover:ring-forest/25 hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {p.name}
                    </h3>
                    <span className="text-sm font-semibold text-forest whitespace-nowrap">
                      {p.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                  <dl className="mt-4 space-y-2 text-xs text-slate-500">
                    <div>
                      <dt className="font-semibold text-slate-700 inline">
                        Use:
                      </dt>{" "}
                      {p.use}
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700 inline">
                        Availability:
                      </dt>{" "}
                      {p.stock}
                    </div>
                  </dl>
                  <button className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-white text-sm font-semibold rounded-full hover:bg-forest-deep transition-colors">
                    Enquire <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Marketplace process
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              How an order flows through SMACOM.
            </h2>
          </div>
          <ol className="grid md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Browse & compare", d: "Explore products with lab reports and origin data attached to every listing." },
              { n: "02", t: "Order & pay", d: "Confirm quantity and delivery window. Pay by mobile money, bank, or invoice." },
              { n: "03", t: "Track dispatch", d: "Live logistics tracking through SMACOM-OS from facility to your farm gate." },
              { n: "04", t: "Confirm & rate", d: "Confirm delivery and rate the batch. Feedback improves quality for everyone." },
            ].map((s) => (
              <li
                key={s.n}
                className="p-7 rounded-3xl bg-slate-50 ring-1 ring-slate-200"
              >
                <div className="text-3xl font-bold text-forest font-display">
                  {s.n}
                </div>
                <div className="mt-3 font-bold text-slate-900">{s.t}</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
