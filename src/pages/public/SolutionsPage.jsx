import React from 'react';
import {
  Truck,
  Recycle,
  Leaf,
  Sprout,
  Wheat,
  Wind,
  Cpu,
  BarChart3,
} from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { CtaBanner } from '@/components/public/CtaBanner';
import wasteCollection from '@/assets/waste-collection.jpg';
import bioProcessing from '@/assets/bio-processing.jpg';
import marketplace from '@/assets/marketplace.jpg';
import farmers from '@/assets/farmers.jpg';
import iotSensor from '@/assets/iot-sensor.jpg';
import impact from '@/assets/impact.jpg';
import analytics from '@/assets/analytics.jpg';
import community from '@/assets/community.jpg';

const SOLUTIONS = [
  {
    icon: Truck,
    tag: 'Collection',
    title: 'Smart Waste Collection',
    desc: 'Route-optimized organic waste collection for hotels, markets, campuses, and municipalities with digital chain-of-custody at every pickup.',
    business: 'Support better collection planning and clearer records for operational and sustainability teams.',
    environment: 'Keep separated organic material visible as it moves toward productive processing.',
    who: 'Hospitality groups, food producers, municipalities, retail chains.',
    img: wasteCollection,
  },
  {
    icon: Recycle,
    tag: 'Processing',
    title: 'Bio-Processing Infrastructure',
    desc: 'Sensor-monitored composting and anaerobic digestion facilities engineered for consistent, high-quality nutrient recovery.',
    business: 'Connect processing workflows with the operational information teams need to improve consistency.',
    environment: 'Make processing activity easier to monitor and review over time.',
    who: 'Facility operators, waste utilities, investors, industrial estates.',
    img: bioProcessing,
  },
  {
    icon: Leaf,
    tag: 'Circular Economy',
    title: 'Circular Economy Enablement',
    desc: 'The connective tissue between producers, processors, and end-users, with clear records across the chain.',
    business: 'Support practical commercial coordination between participants in an organic value chain.',
    environment: 'Give teams a stronger basis for reviewing activity and communicating progress.',
    who: 'Corporates with sustainability targets, ESG investors, regulators.',
    img: impact,
  },
  {
    icon: Sprout,
    tag: 'Organic Fertilizer',
    title: 'Organic Fertilizer Marketplace',
    desc: 'A marketplace for processed organic inputs and the people who use them.',
    business: 'Connect processors with agricultural buyers and support clearer ordering workflows.',
    environment: 'Help farmers find organic inputs with better information about their source and use.',
    who: 'Smallholder farmers, cooperatives, commercial agriculture operators.',
    img: marketplace,
  },
  {
    icon: Wheat,
    tag: 'Animal Feed',
    title: 'Bio-Based Animal Feed',
    desc: 'Nutritionally balanced protein feeds from qualified organic waste streams, formulated for poultry, aquaculture, and livestock.',
    business: 'Diversify processing revenue and give feed buyers a lower-cost, traceable alternative.',
    environment: 'Cuts reliance on imported feed protein and reduces the emissions footprint of animal agriculture.',
    who: 'Poultry producers, aquaculture farms, feed distributors.',
    img: farmers,
  },
  {
    icon: Wind,
    tag: 'Environmental Monitoring',
    title: 'Environmental Monitoring',
    desc: 'Continuous monitoring of air, soil, and water quality around processing facilities and farmer partner sites.',
    business: 'Meet regulatory obligations effortlessly with automated reports and audit-ready evidence.',
    environment: 'Early detection of pollution risks and quantified environmental co-benefits from every intervention.',
    who: 'Facility operators, regulators, ESG teams, research partners.',
    img: iotSensor,
  },
  {
    icon: BarChart3,
    tag: 'Reporting',
    title: 'Environmental Reporting',
    desc: 'Organise the activity records teams need to review organic waste operations and communicate progress.',
    business: 'Create a clearer reporting workflow for operators, partners and sustainability teams.',
    environment: 'Keep claims connected to the records and methods that support them.',
    who: 'Cities, corporate sustainability teams, program partners.',
    img: analytics,
  },
  {
    icon: Cpu,
    tag: 'Digital Waste Tracking',
    title: 'Digital Waste Tracking',
    desc: 'Every bin, batch, and delivery gets a digital identity, giving every stakeholder line-of-sight from source to soil.',
    business: 'Eliminate paperwork, prove compliance, and provide a data asset to your investors and customers.',
    environment: 'Traceability helps teams report clearly and reduce room for weak environmental claims.',
    who: 'Municipalities, corporations, cooperatives, program funders.',
    img: community,
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Solutions"
        title={<>End-to-end infrastructure for the circular waste economy.</>}
        description="Eight connected solutions turn organic waste into environmental impact and shared value, whether you operate a single restaurant or a national utility."
        image={bioProcessing}
        imageAlt="Interior of a SMACOM bio-processing facility"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon;
            const reverse = i % 2 === 1;
            return (
              <div key={s.title} className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
                <div className="lg:col-span-6 [direction:ltr]">
                  <div className="relative overflow-hidden rounded-[36px] shadow-xl ring-1 ring-black/5">
                    <img src={s.img} alt={s.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  </div>
                </div>
                <div className="lg:col-span-6 [direction:ltr]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecfdf3] text-[#166534] text-[11px] font-bold uppercase tracking-widest mb-5">
                    <Icon size={14} /> {s.tag}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display leading-tight text-balance">{s.title}</h2>
                  <p className="mt-4 text-lg text-slate-600 leading-relaxed">{s.desc}</p>
                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-[#166534]">Business impact</div>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{s.business}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#ecfdf3]/40 ring-1 ring-[#bbf7d0]">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-[#166534]">Environmental impact</div>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{s.environment}</p>
                    </div>
                  </div>
                  <div className="mt-5 text-sm text-slate-500"><span className="font-semibold text-slate-700">Built for:</span> {s.who}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
