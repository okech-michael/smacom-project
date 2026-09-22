import React from 'react';

export function CtaBanner() {
  return (
    <section className="cta-banner-section py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#134e4a] p-10 text-center text-white shadow-[0_20px_60px_rgba(15,118,110,0.16)] md:p-20">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -top-24 -right-24 size-80 rounded-full blur-3xl opacity-60" style={{ background: '#86efac' }} />
          <div className="absolute -bottom-24 -left-20 size-72 rounded-full blur-3xl opacity-30" style={{ background: '#bbf7d0' }} />
          <div className="relative">
            <span className="eyebrow eyebrow-dark">Get started</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold font-display text-balance">
              Ready to turn organic waste into measurable value?
            </h2>
            <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto text-pretty">
              Whether you generate organic waste, process it, or use the outputs, SMACOM gives you the infrastructure to operate more efficiently and report with confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="button-amber">Request a demo</a>
              <a href="/solutions" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 font-semibold text-white transition hover:bg-white/10">Explore solutions</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
