import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDot,
  Factory,
  LineChart,
  MapPinned,
  Sprout,
  Truck,
} from 'lucide-react';
import heroAerial from '@/assets/hero-aerial.jpg';
import wasteCollection from '@/assets/waste-collection.jpg';
import bioProcessing from '@/assets/bio-processing.jpg';
import marketplace from '@/assets/marketplace.jpg';
import analytics from '@/assets/analytics.jpg';
import { CtaBanner } from '@/components/public/CtaBanner';

const SOLUTIONS = [
  {
    title: 'Waste producers',
    audience: 'Hotels, markets, campuses, municipalities and institutions.',
    problem: 'Disposal costs, compliance pressure and limited visibility.',
    provides: 'Digital tracking, scheduled collection and impact reporting.',
    outcome: 'Lower disposal costs and sustainability data your team can use.',
    href: '/solutions',
    image: wasteCollection,
  },
  {
    title: 'Bio-processors',
    audience: 'Composting and anaerobic digestion operators.',
    problem: 'Inconsistent feedstock quality and limited process visibility.',
    provides: 'Sensor-monitored operations and quality optimisation tools.',
    outcome: 'More consistent nutrient recovery and reliable offtake.',
    href: '/solutions',
    image: bioProcessing,
  },
  {
    title: 'Eco marketplace',
    audience: 'Farmers and agricultural buyers.',
    problem: 'Limited access to consistent quality agricultural inputs.',
    provides: 'A direct marketplace for processed organic outputs.',
    outcome: 'More confident sourcing of traceable soil and farm inputs.',
    href: '/marketplace',
    image: marketplace,
  },
];

const STEPS = [
  { label: 'Source', description: 'Organisations identify and separate organic material at the point of generation.', icon: CircleDot },
  { label: 'Collect', description: 'Scheduled collection connects material to the right processing capacity.', icon: Truck },
  { label: 'Process', description: 'Operators manage organic streams and monitor the information that matters.', icon: Factory },
  { label: 'Match', description: 'Processed outputs are connected with agricultural buyers and farmers.', icon: MapPinned },
  { label: 'Farm', description: 'Useful inputs return to the field with clearer records of origin and use.', icon: Sprout },
];

const PLATFORM_POINTS = [
  ['Digital platform', 'Coordinate participants, records and workflows across the organic value chain.'],
  ['IoT monitoring', 'Bring operational sensor data into the places teams use to manage processing.'],
  ['Marketplace', 'Connect processed outputs with farmers and agricultural buyers.'],
  ['Data and reporting', 'Turn activity records into practical reporting for operations and partners.'],
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-background">
      <section className="relative border-b border-border/70 bg-[#f4f8f6]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow">Circular organic infrastructure</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.5rem]">
              Organic waste infrastructure that connects producers, processors and farmers.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#475569]">
              SMACOM provides the digital platform, IoT monitoring and marketplace that turn organic waste streams into measurable agricultural inputs and verified impact data.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="button-primary">Request a demo <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/solutions" className="button-secondary">Explore solutions</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#475569]">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#0f766e]" /> Source-to-farm visibility</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#0f766e]" /> Built for Kenyan operators</span>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#d9e5e0] bg-white shadow-[0_20px_60px_rgba(15,118,110,0.12)]">
              <img src={heroAerial} alt="Organic farm and processing landscape" className="aspect-[4/3] h-full w-full object-cover" fetchPriority="high" />
              <div className="grid grid-cols-3 divide-x divide-[#d9e5e0] border-t border-[#d9e5e0] bg-white">
                <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Source</p><p className="mt-1 text-sm font-semibold text-[#0f172a]">Capture</p></div>
                <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Process</p><p className="mt-1 text-sm font-semibold text-[#0f172a]">Recover</p></div>
                <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Farm</p><p className="mt-1 text-sm font-semibold text-[#0f172a]">Apply</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white py-16 md:py-20" aria-labelledby="problem-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-12 md:gap-16 lg:px-8">
          <div className="md:col-span-5"><p className="eyebrow">The operating challenge</p><h2 id="problem-heading" className="section-heading mt-4">Organic waste is still a cost and an emissions problem.</h2></div>
          <div className="space-y-5 text-lg leading-8 text-[#475569] md:col-span-7"><p>Organic waste is still treated as a disposal problem in most places. The result is lost nutrients, rising costs and avoidable methane emissions.</p><p>SMACOM organises the chain from source to processing to farm, giving every participant visibility, better economics and measurable outcomes.</p></div>
        </div>
      </section>

      <section className="bg-[#f7faf8] py-20 md:py-28" aria-labelledby="solutions-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">Solutions for the value chain</p><h2 id="solutions-heading" className="section-heading mt-4">One infrastructure layer. Three practical entry points.</h2></div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {SOLUTIONS.map((solution) => (
              <article key={solution.title} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfe9e4] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1">
                <img src={solution.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0f172a]">{solution.title}</h3>
                  <dl className="mt-6 space-y-4 text-sm leading-6"><div><dt className="font-semibold text-[#0f766e]">Who</dt><dd className="text-[#475569]">{solution.audience}</dd></div><div><dt className="font-semibold text-[#0f766e]">The problem</dt><dd className="text-[#475569]">{solution.problem}</dd></div><div><dt className="font-semibold text-[#0f766e]">What SMACOM provides</dt><dd className="text-[#475569]">{solution.provides}</dd></div><div><dt className="font-semibold text-[#0f766e]">Outcome</dt><dd className="text-[#475569]">{solution.outcome}</dd></div></dl>
                  <Link to={solution.href} className="mt-7 inline-flex min-h-12 items-center gap-2 font-semibold text-[#0f766e] hover:text-[#0d9488]">{solution.title === 'Eco marketplace' ? 'Explore the marketplace' : `See how it works for ${solution.title}`}<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">How the system works</p><h2 id="process-heading" className="section-heading mt-4">From source to farm, one connected flow.</h2><p className="mt-5 text-lg leading-8 text-[#475569]">Follow the journey of organic material through the people, operations and decisions that give it a useful next life.</p></div>
          <ol className="mt-12 grid gap-8 md:grid-cols-5 md:gap-4">{STEPS.map((step, index) => { const Icon = step.icon; return <li key={step.label} className="relative md:px-3 md:text-center"><div className="flex items-center gap-4 md:block"><div className="relative z-10 mx-auto grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e7f3ef] text-[#0f766e] ring-8 ring-white"><Icon className="h-6 w-6" /></div><div><p className="mt-0 text-xs font-semibold uppercase tracking-widest text-[#f59e0b] md:mt-5">0{index + 1}</p><h3 className="mt-1 text-lg font-semibold text-[#0f172a]">{step.label}</h3></div></div><p className="mt-3 text-sm leading-6 text-[#64748b] md:mt-4">{step.description}</p>{index < STEPS.length - 1 && <div className="absolute left-7 top-14 hidden h-px w-[calc(100%-1.75rem)] bg-[#c9ddd6] md:block" />}</li>; })}</ol>
        </div>
      </section>

      <section className="bg-[#134e4a] py-20 text-white md:py-28" aria-labelledby="platform-heading">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10"><img src={analytics} alt="SMACOM platform analytics interface" loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="grid grid-cols-2 gap-px bg-white/15"><div className="bg-[#134e4a] p-5"><BarChart3 className="h-5 w-5 text-[#f59e0b]" /><p className="mt-3 text-sm font-semibold">Operational records</p></div><div className="bg-[#134e4a] p-5"><LineChart className="h-5 w-5 text-[#f59e0b]" /><p className="mt-3 text-sm font-semibold">Decision support</p></div></div></div>
          <div><p className="eyebrow eyebrow-dark">Platform and technology</p><h2 id="platform-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">The operating layer for organic circular systems.</h2><p className="mt-6 text-lg leading-8 text-white/75">SMACOM combines the digital platform, monitoring tools, marketplace and reporting infrastructure needed to coordinate an organic value chain.</p><div className="mt-8 grid gap-5 sm:grid-cols-2">{PLATFORM_POINTS.map(([title, description]) => <div key={title} className="border-t border-white/20 pt-4"><p className="font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-white/70">{description}</p></div>)}</div><Link to="/contact" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#f59e0b] px-5 font-semibold text-[#0f172a] transition hover:bg-[#fbbf24]">Talk to the team <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="bg-[#f7faf8] py-20 md:py-24" aria-labelledby="impact-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-12 md:items-center lg:px-8"><div className="md:col-span-7"><p className="eyebrow">Impact and proof</p><h2 id="impact-heading" className="section-heading mt-4">Built for measurable progress, with evidence that can be reviewed.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">The platform is designed to help teams record activity, coordinate operations and build a clearer evidence base over time. Verified outcomes belong here when the supporting data and permissions are available.</p></div><div className="rounded-2xl border border-dashed border-[#9bbeb3] bg-white p-7 md:col-span-5"><p className="text-sm font-semibold uppercase tracking-widest text-[#0f766e]">Evidence-led by design</p><p className="mt-4 text-lg leading-8 text-[#475569]">No unverified statistics, testimonials or partner logos are presented on this page.</p></div></div>
      </section>

      <CtaBanner />
    </div>
  );
}
