import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
              <img src={logo} alt="SMACOM logo" className="h-8 w-8 object-cover rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">SMACOM</p>
              <p className="text-xs text-muted-foreground">Solutions</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
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
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Register
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-lg font-semibold text-white">SMACOM Solutions</p>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              A digital infrastructure platform for turning organic waste into measurable value for communities, processors, farmers, and learners.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/solutions" className="transition hover:text-white">Solutions</Link>
            <Link to="/impact" className="transition hover:text-white">Impact</Link>
            <Link to="/contact" className="transition hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
