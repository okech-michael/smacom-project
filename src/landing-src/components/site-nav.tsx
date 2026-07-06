import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site-data";
import { AuthModal } from "@/components/auth-modal";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState<null | "login" | "register">(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/75 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-forest font-display shrink-0"
          >
            SMACOM<span className="text-spring">.</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-slate-700">
            {NAV_LINKS.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="transition-colors hover:text-forest"
                activeProps={{ className: "text-forest font-semibold" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAuth("login")}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 rounded-full hover:text-forest hover:bg-slate-100 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setAuth("register")}
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold bg-forest text-white rounded-full hover:bg-forest-deep transition-all shadow-lg shadow-forest/10"
            >
              Register
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="xl:hidden p-2 rounded-full hover:bg-slate-100 text-slate-700"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-slate-700 hover:text-forest"
                  activeProps={{ className: "text-forest font-semibold" }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="col-span-2 flex gap-2 pt-3 mt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setOpen(false);
                    setAuth("login");
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-forest border border-forest/20 rounded-full"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setAuth("register");
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold bg-forest text-white rounded-full"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        open={auth !== null}
        mode={auth ?? "login"}
        onClose={() => setAuth(null)}
      />
    </>
  );
}
