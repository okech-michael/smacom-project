import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';
import logo from '@/assets/ml.jpg';
import { useAuth } from '@/lib/AuthContext';

const links = [
  { to: '/about', label: 'About' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/impact', label: 'Impact' },
  { to: '/learning', label: 'Learning' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="site-header sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="brand-mark flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden ring-2 ring-primary/25 shadow-sm">
              <img src={logo} alt="SMACOM logo" className="h-12 w-12 object-cover rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">SMACOM</p>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.16em]">Solutions</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="nav-link text-sm font-medium text-muted-foreground transition hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Register
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-accent md:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="site-footer border-t border-border/70 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="brand-mark flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden ring-2 ring-primary/30 shadow-sm">
                <img src={logo} alt="SMACOM logo" className="h-12 w-12 object-cover rounded-full" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[0.2em] text-white uppercase">SMACOM</p>
                <p className="text-xs text-slate-400 uppercase tracking-[0.12em]">Solutions</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
              A digital infrastructure platform for turning organic waste into measurable value for communities, processors, farmers, and learners.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bbf7d0]">Solutions</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/solutions" className="transition hover:text-white">Waste Producers</Link></li>
              <li><Link to="/solutions" className="transition hover:text-white">Bio-Processors</Link></li>
              <li><Link to="/marketplace" className="transition hover:text-white">Eco Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bbf7d0]">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/about" className="transition hover:text-white">About</Link></li>
              <li><Link to="/impact" className="transition hover:text-white">Impact</Link></li>
              <li><Link to="/learning" className="transition hover:text-white">Learning</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bbf7d0]">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>SMACOM Solutions</p>
              <p>Kenya</p>
              <a href="mailto:hello@smacom.co.ke" className="transition hover:text-white">hello@smacom.co.ke</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-slate-400 lg:px-8">
            <span>Copyright 2026 SMACOM Solutions</span>
            <div className="flex gap-6">
              <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
              <Link to="/terms" className="transition hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
