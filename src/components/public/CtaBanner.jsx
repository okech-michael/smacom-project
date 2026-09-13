import React from 'react';

export function CtaBanner() {
  return (
    <section className="cta-banner-section py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-[#163f2c] text-white p-12 md:p-20 text-center shadow-[0_24px_80px_rgba(22,101,52,0.2)]">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -top-24 -right-24 size-80 rounded-full blur-3xl opacity-60" style={{ background: '#86efac' }} />
          <div className="absolute -bottom-24 -left-20 size-72 rounded-full blur-3xl opacity-30" style={{ background: '#bbf7d0' }} />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#bbf7d0]">Operational circular economy</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold font-display text-balance">
              Join the system. Turn waste into measurable value.
            </h2>
            <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto text-pretty">
              Whether you produce waste, process it, or grow with it, SMACOM gives you the platform, tools, and network to scale your impact.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#bbf7d0] text-[#14532d] font-bold rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#bbf7d0]/20"
              >
                Request a Demo
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors border border-white/15"
              >
                Talk to Partnerships
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
