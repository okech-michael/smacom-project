import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import heroAerial from '@/assets/hero-aerial.jpg';
import wasteCollection from '@/assets/waste-collection.jpg';
import bioProcessing from '@/assets/bio-processing.jpg';
import iotSensor from '@/assets/iot-sensor.jpg';
import analytics from '@/assets/analytics.jpg';
import farmers from '@/assets/farmers.jpg';
import marketplace from '@/assets/marketplace.jpg';
import community from '@/assets/community.jpg';
import { CtaBanner } from '@/components/public/CtaBanner';

const STATS = [
  { value: '1.2M', label: 'Tons of organic waste diverted' },
  { value: '840K', label: 'Tons of CO₂ equivalent avoided' },
  { value: '52K+', label: 'Farmers active on the network' },
  { value: '38', label: 'Processing facilities integrated' },
];

const SOLUTIONS = [
  {
    n: '01',
    title: 'Waste Producers',
    desc: 'Digital tracking, scheduled collection, and impact reporting for hotels, markets, campuses, and municipalities.',
    img: wasteCollection,
    href: '/solutions',
  },
  {
    n: '02',
    title: 'Bio-Processors',
    desc: 'Sensor-monitored composting and anaerobic digestion facilities engineered for optimal nutrient recovery.',
    img: bioProcessing,
    href: '/solutions',
  },
  {
    n: '03',
    title: 'Eco Marketplace',
    desc: 'Direct-to-farmer distribution of premium bio-fertilizer, biochar, and animal feed produced from processed waste.',
    img: marketplace,
    href: '/marketplace',
  },
];

const ECOSYSTEM = [
  { icon: Truck, label: 'Waste Producer', desc: 'Segregation at source' },
  { icon: Leaf, label: 'Collection', desc: 'Smart route logistics' },
  { icon: Factory, label: 'Bio-Processor', desc: 'Nutrient recovery' },
  { icon: Cpu, label: 'IoT Monitoring', desc: 'Real-time telemetry' },
  { icon: ShoppingBag, label: 'Marketplace', desc: 'Fair-price distribution' },
  { icon: Sprout, label: 'Farmer', desc: 'Regenerative growth' },
  { icon: Globe2, label: 'Impact', desc: 'Verified carbon reduction' },
];

const TESTIMONIALS = [
  {
    quote: 'SMACOM turned our kitchen waste liability into a revenue line. Their IoT dashboards make sustainability reporting effortless for our sixty properties.',
    name: 'Amina Okoye',
    role: 'Head of Sustainability, Lakeside Hotel Group',
  },
  {
    quote: 'The bio-fertilizer we source through the marketplace has lifted our yields measurably. Our soil is genuinely healthier than it was three seasons ago.',
    name: 'Joseph Mwangi',
    role: 'Farmer, Rift Valley Cooperative',
  },
  {
    quote: 'As a municipality we need traceability. The SMACOM platform gives us line-of-sight from bin to farm, with the audit trail our regulators expect.',
    name: 'Dr. Elena Rossi',
    role: 'Waste Director, City of Genova',
  },
];

const PARTNERS = ['MinAgri', 'UNEP', 'GreenTech', 'AgriBank', 'EcoCert', 'OpenClimate'];

const NEWS = [
  {
    tag: 'Announcement',
    date: 'March 12, 2026',
    title: 'SMACOM opens flagship bio-processing facility in Kisumu',
    excerpt: 'The new plant will divert 40,000 tons of organic waste annually and supply 12,000 farmers with certified bio-fertilizer.',
    img: bioProcessing,
  },
  {
    tag: 'Research',
    date: 'February 28, 2026',
    title: 'How IoT telemetry raised compost quality by 32%',
    excerpt: 'A field study across eight processing sites shows how real-time sensor loops optimize aeration and microbial activity.',
    img: iotSensor,
  },
  {
    tag: 'Impact',
    date: 'February 4, 2026',
    title: 'Community collection pilot delivers first carbon credits',
    excerpt: 'Our neighborhood collection model in Nairobi has been verified for high-quality nature-based carbon removal.',
    img: community,
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(1200px 600px at 15% 0%, rgba(187, 247, 208, 0.35), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(147, 197, 253, 0.3), transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecfdf3] text-[#166534] text-[11px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
              </span>
              Climate-tech for the circular economy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.02] text-balance font-display">
              Turning Organic Waste into <span className="text-[#166534]">Sustainable Wealth.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              SMACOM Solutions unites waste producers, bio-processors, and farmers in one intelligent platform, converting the world&apos;s organic surplus into regenerative agricultural value.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/solutions" className="inline-flex items-center gap-2 px-7 py-4 bg-[#166534] text-white font-semibold rounded-2xl hover:bg-[#14532d] transition-colors shadow-xl shadow-[#166534]/15">
                Explore Solutions <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 border border-slate-200 text-slate-900 font-semibold rounded-2xl hover:bg-slate-50 transition-colors">
                Request a Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[40px] shadow-2xl outline outline-1 -outline-offset-1 outline-black/5">
              <img src={heroAerial} alt="Aerial view of a circular organic farm and bio-processing facility" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-6 md:-left-10 bg-white/95 backdrop-blur-md p-6 md:p-7 rounded-2xl shadow-2xl border border-slate-100 max-w-[260px]">
              <div className="text-4xl font-bold text-[#166534] font-display">140k+</div>
              <div className="mt-1 text-sm text-slate-500 font-medium leading-snug">Tons of waste diverted from landfills this year alone.</div>
            </div>
            <div className="absolute -top-6 -right-4 md:-right-8 bg-[#166534] text-white p-5 rounded-2xl shadow-xl max-w-[220px]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#bbf7d0]">
                <span className="size-2 rounded-full bg-[#bbf7d0] animate-pulse" />
                Live IoT
              </div>
              <div className="mt-2 text-sm font-medium leading-snug">Processing 4.2 tons of organic matter per hour at Site A.</div>
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32 max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-bold text-[#166534] font-display">{s.value}</div>
                <div className="mt-1.5 text-sm text-slate-500 font-medium leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Our Mission</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display leading-tight text-balance">
              A regenerative economy, built from the ground up.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              Every year, more than a billion tons of organic material end up in landfills, releasing methane and starving soils of the nutrients they need. SMACOM exists to redirect that flow — turning what was once a burden into an engine for prosperity.
            </p>
            <p>
              Through smart collection, high-integrity processing, verifiable impact, and a transparent marketplace, we make it commercially obvious to close the organic loop. The result is cleaner cities, healthier soils, better livelihoods, and a measurably lighter planet.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Solutions</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">A complete circular ecosystem.</h2>
            <p className="mt-5 text-lg text-slate-600 max-w-2xl">One integrated platform serving every stakeholder in the organic value chain, from the point of waste to the point of harvest.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {SOLUTIONS.map((s) => (
              <Link key={s.title} to={s.href} className="group flex flex-col p-8 bg-white rounded-3xl border border-slate-200 hover:border-[#166534]/30 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="size-12 rounded-2xl grid place-items-center mb-6 font-bold text-lg font-display bg-[#ecfdf3] text-[#166534]">
                  {s.n}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{s.desc}</p>
                <div className="mt-auto overflow-hidden rounded-xl aspect-[16/10]">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[#166534] font-semibold">Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">How SMACOM Works</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">One loop. Seven touchpoints. Zero waste.</h2>
            <p className="mt-5 text-lg text-slate-600">Follow a banana peel from a hotel kitchen in Nairobi to a maize field in Nakuru. Every step is measured, monetized, and regenerative.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#166534]/25 to-transparent" />
            <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {ECOSYSTEM.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.label} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 grid size-16 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm text-[#166534]"><Icon size={22} /></div>
                    <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#22c55e]">Step {String(i + 1).padStart(2, '0')}</div>
                    <div className="mt-1 font-semibold text-slate-900">{step.label}</div>
                    <div className="mt-1 text-sm text-slate-500 leading-snug">{step.desc}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#166534] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
                <img src={iotSensor} alt="IoT soil sensor in field" loading="lazy" className="w-full aspect-[4/5] object-cover" />
              </div>
              <div className="pt-12">
                <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
                  <img src={analytics} alt="Analytics dashboard" loading="lazy" className="w-full aspect-[4/5] object-cover" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#bbf7d0]">Technology</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold font-display text-balance">Data-rich operating infrastructure for every link in the loop.</h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">SMACOM-OS turns every collection event, processing batch, and marketplace exchange into an auditable digital asset so communities and investors can trust the outcomes.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-[#bbf7d0] font-semibold"><LineChart size={16} /> Live monitoring</div>
                <p className="mt-2 text-sm text-white/70">Sensor-backed visibility across collection, processing, and field performance.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-[#bbf7d0] font-semibold"><ShieldCheck size={16} /> Verified outcomes</div>
                <p className="mt-2 text-sm text-white/70">High-integrity reporting that supports carbon, compliance, and community narratives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-14">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">What people say</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">Trusted by operators, farmers, and municipalities.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
                <p className="text-slate-600 leading-relaxed">“{t.quote}”</p>
                <div className="mt-6">
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Partners & networks</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 font-display">Built with organizations shaping the future of food and waste.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((partner) => (
              <div key={partner} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-600">{partner}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">From the newsroom</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">News and updates from the field.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {NEWS.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">
                <img src={item.img} alt={item.title} loading="lazy" className="h-48 w-full object-cover" />
                <div className="p-6">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#22c55e]">{item.tag}</div>
                  <div className="mt-2 text-sm text-slate-500">{item.date}</div>
                  <h3 className="mt-3 text-xl font-bold text-slate-900 font-display leading-snug">{item.title}</h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
