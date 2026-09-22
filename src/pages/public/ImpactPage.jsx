import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, FileCheck2, LineChart } from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { CtaBanner } from '@/components/public/CtaBanner';
import impact from '@/assets/impact.jpg';

const EVIDENCE_AREAS = [
  ['Operational records', 'Track collection, processing and marketplace activity in one connected system.', BarChart3],
  ['Reporting workflows', 'Give teams a practical foundation for reviewing performance and communicating progress.', LineChart],
  ['Reviewable evidence', 'Publish outcomes when the underlying data, methodology and permissions are available.', FileCheck2],
];

export default function ImpactPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Impact"
        title={<>Make progress measurable and reviewable.</>}
        description="SMACOM helps organisations record the activity behind organic waste systems so operational and environmental progress can be assessed with appropriate evidence."
        image={impact}
        imageAlt="Organic landscape used to illustrate measurable environmental progress"
      />

      <section className="bg-white py-20 md:py-28" aria-labelledby="evidence-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Evidence-led by design</p>
            <h2 id="evidence-heading" className="section-heading mt-4">Impact reporting should start with the record, not the headline.</h2>
            <p className="mt-5 text-lg leading-8 text-[#475569]">The public site does not publish statistics, testimonials or partner claims until supporting information is available for client review and sign-off.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {EVIDENCE_AREAS.map(([title, description, Icon]) => (
              <div key={title} className="rounded-2xl border border-[#dfe9e4] bg-[#f7faf8] p-7">
                <Icon className="h-6 w-6 text-[#0f766e]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-[#0f172a]">{title}</h3>
                <p className="mt-3 leading-7 text-[#475569]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7faf8] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-12 lg:px-8">
          <div className="md:col-span-7">
            <p className="eyebrow">Work with the team</p>
            <h2 className="section-heading mt-4">Bring the right questions and we can map the evidence you need.</h2>
            <p className="mt-5 text-lg leading-8 text-[#475569]">Whether you generate organic waste, operate processing capacity or use agricultural outputs, start with the workflow and reporting requirements that matter to you.</p>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Link to="/contact" className="button-primary">Discuss your requirements <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
