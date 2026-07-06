import React from 'react';

export function CtaBanner() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-[#166534] text-white p-12 md:p-20 text-center">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div
            className="absolute -top-24 -right-24 size-80 rounded-full blur-3xl opacity-40"
            style={{ background: '#86efac' }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-balance">
              Ready to join the circular revolution?
            </h2>
            <p className="mt-5 text-white/70 text-lg max-w-2xl mx-auto text-pretty">
              Whether you produce waste, process it, or grow with it, SMACOM gives you the platform, tools, and network to scale your impact.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#bbf7d0] text-[#14532d] font-bold rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-[#bbf7d0]/20"
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
