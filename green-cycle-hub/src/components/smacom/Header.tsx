import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/smacom/Logo";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
  ariaLabel?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "#how-it-works", label: "How it works", ariaLabel: "How it works section" },
  { href: "#who-its-for", label: "Who it's for", ariaLabel: "Who it's for section" },
  { href: "#marketplace", label: "Marketplace", ariaLabel: "Marketplace section" },
  { href: "#learning", label: "Learning", ariaLabel: "Learning section" },
  { href: "#plans", label: "Plans", ariaLabel: "Plans section" },
];

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  
  // Extract the section ID from the href
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update URL hash
    window.history.pushState(null, "", href);
  }
};

export function Header({ scrolled }: { scrolled: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, ariaLabel }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => scrollToSection(e, href)}
                  className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
                  aria-label={ariaLabel || label}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Login to your account"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/25"
            aria-label="Sign up and get started"
          >
            <Link to="/register">Get Started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#070f0a] border-l border-white/10 z-40 p-6 md:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <button
                  onClick={closeMobileMenu}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav List */}
              <nav role="navigation">
                <ul className="flex flex-col gap-1 mb-8">
                  {NAV_LINKS.map(({ href, label, ariaLabel }) => (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={(e) => {
                          scrollToSection(e, href);
                          closeMobileMenu();
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium"
                        aria-label={ariaLabel || label}
                      >
                        {label}
                        <ChevronRight className="h-4 w-4 opacity-40" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="space-y-2 border-t border-white/10 pt-6">
                <Button
                  asChild
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                >
                  <Link to="/register" onClick={closeMobileMenu}>
                    Get Started Free
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/10 text-white/70 hover:text-white"
                >
                  <Link to="/login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
