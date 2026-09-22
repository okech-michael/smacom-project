import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';

const FAQS = [
  {
    q: 'How do we become a waste producer partner?',
    a: 'Get in touch through this form or the Register button in the header. Our onboarding team will assess your volumes, agree a service level, and schedule your first collection route.',
  },
  {
    q: 'Do you operate outside East Africa?',
    a: 'Yes. We have active programs across East Africa and Europe, and are expanding through partnership models in West Africa and South Asia.',
  },
  {
    q: 'Where can I buy SMACOM bio-fertilizer?',
    a: 'Contact the team to discuss marketplace access, product information and cooperative onboarding.',
  },
  {
    q: 'How do you verify environmental impact?',
    a: 'The team can discuss the records and reporting workflows relevant to your programme. Specific verified outcomes require supporting data and review.',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s build the circular economy together.</>}
        description="Tell us what you are working on and we can help map the next step, from collection and processing to learning and market access."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl bg-slate-50 ring-1 ring-slate-200">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#ecfdf3] text-[#166534] text-2xl font-bold">✓</div>
                  <h3 className="mt-4 text-2xl font-bold font-display text-slate-900">Thank you.</h3>
                  <p className="mt-2 text-slate-600 max-w-sm mx-auto">A member of our team will be in touch within one business day.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="grid gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full name"><input required className={inputCls} placeholder="Your name" /></Field>
                    <Field label="Email"><input required type="email" className={inputCls} placeholder="you@company.com" /></Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Organization"><input className={inputCls} placeholder="Company or agency" /></Field>
                    <Field label="Enquiry type">
                      <select className={inputCls} defaultValue="partnership">
                        <option value="partnership">Partnership</option>
                        <option value="demo">Product demo</option>
                        <option value="marketplace">Marketplace order</option>
                        <option value="media">Media & press</option>
                        <option value="careers">Careers</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Message">
                    <textarea required rows={5} className={inputCls + ' resize-none'} placeholder="Tell us a little about what you're working on." />
                  </Field>
                  <button type="submit" className="mt-2 justify-self-start px-8 py-3.5 bg-[#166534] text-white font-semibold rounded-full hover:bg-[#14532d] transition-colors">
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>

          <div id="partnerships" className="lg:col-span-5 space-y-6">
            <InfoCard icon={Mail} title="Email" body="hello@smacom.co.ke" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">FAQ</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 font-display text-balance">Answers to the questions we hear most.</h2>
          </div>
          <div className="divide-y divide-slate-200 rounded-3xl ring-1 ring-slate-200 bg-white overflow-hidden">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-6 open:bg-slate-50">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-slate-900">{f.q}</span>
                  <span className="ml-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-600 group-open:bg-[#166534] group-open:text-white transition-colors">+</span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 focus:border-[#166534]';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({ icon: Icon, title, body }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200 flex items-start gap-4">
      <div className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-slate-200 text-[#166534] shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-500">{title}</div>
        <div className="mt-0.5 font-semibold text-slate-900">{body}</div>
      </div>
    </div>
  );
}
