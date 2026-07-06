import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Linkedin, Twitter, Facebook, Youtube, Mail } from "lucide-react";

const COLS = [
  {
    title: "Solutions",
    links: [
      { to: "/solutions", label: "Waste Collection" },
      { to: "/solutions", label: "Bio-Processing" },
      { to: "/solutions", label: "Circular Economy" },
      { to: "/solutions", label: "Carbon Reduction" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/technology", label: "Technology" },
      { to: "/marketplace", label: "Marketplace" },
      { to: "/learning", label: "Learning Hub" },
      { to: "/impact", label: "Impact Tracking" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/projects", label: "Projects" },
      { to: "/news", label: "News & Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Support" },
      { to: "/contact", label: "Partner Program" },
      { to: "/contact", label: "Press Kit" },
    ],
  },
] as const;

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold text-forest font-display inline-flex items-center"
            >
              SMACOM<span className="text-spring">.</span>
            </Link>
            <p className="mt-5 text-slate-500 max-w-xs leading-relaxed">
              Enabling sustainable wealth through intelligent organic waste
              management, circular technology, and empowered agriculture.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                setStatus('sending');
                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  if (res.ok) {
                    setStatus('success');
                    setEmail('');
                  } else {
                    setStatus('error');
                  }
                } catch (err) {
                  setStatus('error');
                }
              }}
              className="mt-6 flex max-w-xs items-center rounded-full border border-slate-200 bg-slate-50 pr-1"
            >
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Newsletter email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-9 h-9 grid place-items-center rounded-full bg-forest text-white hover:bg-forest-deep transition-colors"
              >
                {status === 'sending' ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Mail size={15} />
                )}
              </button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-slate-900 mb-5">{col.title}</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link
                      to={l.to}
                      className="hover:text-forest transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} SMACOM Solutions. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-slate-400">
            <a
              href="https://www.linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-forest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-forest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-forest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.youtube.com"
              aria-label="Youtube"
              className="hover:text-forest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube size={18} />
            </a>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/privacy" className="hover:text-forest">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-forest">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-forest">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
