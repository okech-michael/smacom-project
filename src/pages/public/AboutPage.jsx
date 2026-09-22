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
    desc: 'Measurement and clear records help teams understand the work and improve it over time.',
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
    desc: 'Clear responsibilities and reviewable records help stakeholders work from the same information.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="About SMACOM"
        title={<>Building the circular economy the world actually needs.</>}
        description="SMACOM brings together people, facilities, data, and learning to make organic waste a useful resource rather than a disposal problem."
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
              SMACOM began with a simple observation: cities producing large amounts of organic waste were close to farmland that needed organic matter. The infrastructure to connect those two needs was not in place.
            </p>
            <p>
              We started with a community collection route, a pilot compost facility, and a farmer cooperative willing to test the output. Each step helped us understand the work involved in logistics, biology, incentives, and trust.
            </p>
            <p>
              SMACOM is building a connected platform for waste producers, processors, farmers, and learners.
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
