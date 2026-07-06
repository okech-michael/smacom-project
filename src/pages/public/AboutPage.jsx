import React from 'react';
import { Target, Eye, Heart, Award, Users, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { CtaBanner } from '@/components/public/CtaBanner';
import heroAerial from '@/assets/hero-aerial.jpg';
import community from '@/assets/community.jpg';
import farmers from '@/assets/farmers.jpg';

const VALUES = [
  {
    icon: Target,
    title: 'Purpose over Profit',
    desc: 'Every decision is filtered through environmental integrity and community upliftment first, commercial success second.',
  },
  {
    icon: Users,
    title: 'Radical Collaboration',
    desc: 'Waste producers, processors, farmers, learners, and regulators succeed together on one platform, or not at all.',
  },
  {
    icon: Award,
    title: 'Scientific Rigor',
    desc: 'Measurement, verification, and open data underpin every ton diverted and every kilogram of soil restored.',
  },
  {
    icon: Heart,
    title: 'Human-Centered Design',
    desc: 'From street collectors to enterprise operators, every interface is shaped by the people who actually use it.',
  },
  {
    icon: TrendingUp,
    title: 'Regenerative Growth',
    desc: 'We grow when the ecosystem grows: cleaner cities, richer soils, and more resilient communities are the real KPIs.',
  },
  {
    icon: Eye,
    title: 'Transparent by Default',
    desc: 'Traceable inputs, verified outcomes, and open governance keep the platform honest across every stakeholder.',
  },
];

const TIMELINE = [
  {
    year: '2019',
    title: 'The founding thesis',
    desc: 'SMACOM begins as a research project mapping the true economic potential of organic waste streams in East Africa.',
  },
  {
    year: '2020',
    title: 'First processing pilot',
    desc: 'We launch a community-scale composting facility serving 400 households and prove the unit economics.',
  },
  {
    year: '2022',
    title: 'SMACOM-OS platform release',
    desc: 'The role-based operating platform unifies collection, processing, monitoring, and marketplace in one system.',
  },
  {
    year: '2024',
    title: 'Marketplace and Learning launch',
    desc: 'The Eco Marketplace opens to farmers and the Learning Hub certifies its first cohort of circular economy practitioners.',
  },
  {
    year: '2026',
    title: 'Regional expansion',
    desc: 'Flagship facilities and networks activate across three regions, with verified carbon credits issued at scale.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="About SMACOM"
        title={<>Building the circular economy the world actually needs.</>}
        description="We are a team of engineers, scientists, agronomists, and community organizers united by one conviction: that organic waste, treated with intelligence and respect, is one of the most powerful climate assets we have."
        image={heroAerial}
        imageAlt="Aerial view of a SMACOM processing facility surrounded by farmland"
      />

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Our Story</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold font-display text-slate-900 text-balance">
              From a research question to a continental platform.
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              SMACOM began with a simple observation: the same cities generating mountains of organic waste were surrounded by farmland desperate for organic matter. The infrastructure to close that loop — humanely, transparently, and at scale — simply did not exist.
            </p>
            <p>
              We started small. A community collection route. A pilot compost facility. A single farmer cooperative willing to trust the output. Every step taught us something about logistics, biology, incentives, and trust. Then we built the software that made those lessons portable.
            </p>
            <p>
              Today SMACOM is a full-stack climate-tech platform that any waste producer, processor, farmer, or learner can plug into, anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="p-10 md:p-14 rounded-3xl bg-[#166534] text-white">
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Mission</span>
            <h3 className="mt-4 text-3xl md:text-4xl font-bold font-display leading-tight text-balance">
              Convert the world&apos;s organic waste into regenerative economic value.
            </h3>
            <p className="mt-5 text-lg leading-relaxed opacity-80">By connecting every stakeholder in the circular loop through one intelligent platform, we make it economically obvious to do the right environmental thing.</p>
          </div>
          <div className="p-10 md:p-14 rounded-3xl bg-white text-slate-900 ring-1 ring-slate-200">
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Vision</span>
            <h3 className="mt-4 text-3xl md:text-4xl font-bold font-display leading-tight text-balance">
              A world where waste is a beginning, not an end.
            </h3>
            <p className="mt-5 text-lg leading-relaxed opacity-80">We see a decade in which cities export soil health, not landfill methane, and where farmers and processors share transparently in that transformation.</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Our Values</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">Six principles that shape every decision.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-8 rounded-3xl bg-slate-50 ring-1 ring-slate-200 hover:ring-[#166534]/20 hover:bg-white hover:shadow-lg transition-all">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 text-[#166534]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900 font-display">{v.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Company Timeline</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">A decade of iteration.</h2>
          </div>
          <ol className="relative border-l-2 border-slate-200 pl-8 md:pl-12 space-y-12">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-10 md:-left-14 top-1 grid size-6 place-items-center rounded-full bg-[#166534] ring-4 ring-slate-50">
                  <span className="size-2 rounded-full bg-[#22c55e]" />
                </span>
                <div className="text-sm font-bold tracking-widest text-[#22c55e]">{t.year}</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 font-display">{t.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed max-w-2xl">{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden">
            <img src={community} alt="Community outreach" loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
          </div>
          <div className="rounded-3xl overflow-hidden">
            <img src={farmers} alt="Farmers on cooperative land" loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
