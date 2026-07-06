import { X, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { ROLES } from "@/lib/site-data";

interface Props {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
}

export function AuthModal({ open, mode, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const title = mode === "login" ? "Sign in to your portal" : "Create your account";
  const subtitle =
    mode === "login"
      ? "Select your role to continue to the SMACOM platform."
      : "Select the account type that matches your role in the ecosystem.";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-forest-deep/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 z-10"
        >
          <X size={20} />
        </button>
        <div className="p-8 md:p-10 border-b border-slate-100">
          <span className="inline-block px-3 py-1 rounded-full bg-spring/10 text-spring text-xs font-bold uppercase tracking-wider mb-4">
            {mode === "login" ? "Portal Access" : "Join SMACOM"}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
            {title}
          </h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>
        <div className="p-6 md:p-8 grid gap-3 max-h-[60vh] overflow-y-auto">
          {ROLES.map((role) => (
            <a
              key={role.key}
              href={`/portal/${role.key}/${mode}`}
              onClick={(e) => {
                // The SMACOM platform lives outside this marketing site; the
                // link is retained so external routing can pick it up.
                e.preventDefault();
                window.alert(
                  `Redirecting to ${role.title} ${mode} portal (external SMACOM platform).`,
                );
              }}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-forest/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 text-forest font-bold group-hover:bg-forest group-hover:text-white transition-colors">
                {role.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900">{role.title}</div>
                <div className="text-sm text-slate-500 truncate">
                  {role.description}
                </div>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-slate-400 group-hover:text-forest group-hover:translate-x-1 transition-all"
              />
            </a>
          ))}
        </div>
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>
            {mode === "login" ? "New to SMACOM?" : "Already have an account?"}
          </span>
          <button
            onClick={onClose}
            className="font-semibold text-forest hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in instead"} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
