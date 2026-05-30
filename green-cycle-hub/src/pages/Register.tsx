import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/smacom/Logo";
import { ROLES, RoleId } from "@/lib/mock-data";
import { Check, Upload, AlertCircle, Eye, EyeOff, ArrowRight, ChevronLeft, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL, signup } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Choose role", "Your details", "Upload ID", "Verification"];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Register() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleId | null>(null);
  const [formData, setFormData] = useState({
    email: "", password: "", full_name: "", phone: "", organisation: "", address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleNext() {
    if (step === 0 && !role) return;
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.full_name || !formData.phone) {
        setError("Please fill in all required fields.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await signup({
          email: formData.email, password: formData.password, full_name: formData.full_name,
          phone: formData.phone, role: role!, organisation: formData.organisation, address: formData.address,
        });
        // Save token and redirect to dashboard
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("user", JSON.stringify(response.user));
          // Redirect to dashboard immediately
          navigate("/dashboard/learner");
          return;
        }
        setStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-[#050c08] text-white p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-emerald-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative max-w-2xl mx-auto py-10">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                    i < step ? "bg-emerald-500 border-emerald-500 text-black" :
                    i === step ? "border-emerald-500 text-emerald-400 bg-transparent" :
                    "border-white/15 text-white/25 bg-transparent"
                  )}
                  animate={i === step ? { boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 12px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </motion.div>
                <span className={cn("text-[10px] font-semibold hidden sm:block uppercase tracking-wider", i <= step ? "text-white/70" : "text-white/20")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-3 transition-all duration-500", i < step ? "bg-emerald-500" : "bg-white/8")} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-6 sm:p-8"
            >
              {/* ── Step 0: Choose Role ── */}
              {step === 0 && (
                <div>
                  <h1 className="text-2xl font-black text-white">Choose your role</h1>
                  <p className="text-sm text-white/40 mt-1.5">You can update this later from account settings.</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-7">
                    {ROLES.map((r) => (
                      <motion.button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                          role === r.id
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors",
                          role === r.id ? "bg-emerald-500 text-black" : "bg-white/8 text-white/60"
                        )}>
                          <r.icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className={cn("font-bold text-sm", role === r.id ? "text-white" : "text-white/70")}>{r.title}</p>
                          <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{r.desc}</p>
                        </div>
                        {role === r.id && (
                          <div className="ml-auto shrink-0">
                            <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-black" />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 1: Details ── */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-black text-white">Your details</h1>
                  <p className="text-sm text-white/40 mt-1.5">Fill in your information to create your account.</p>

                  {error && (
                    <motion.div
                      className="mt-5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex gap-2 items-start"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      {error}
                    </motion.div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <Field label="Full name" placeholder="Wanjiku Mwangi" value={formData.full_name} onChange={update("full_name")} />
                    <Field label="Email" placeholder="you@example.com" type="email" value={formData.email} onChange={update("email")} />
                    <Field label="Phone" placeholder="+254 700 000 000" value={formData.phone} onChange={update("phone")} />
                    <Field label="Organisation (optional)" placeholder="Green Grocer Market" value={formData.organisation} onChange={update("organisation")} />
                    <div className="sm:col-span-2">
                      <Field label="Address" placeholder="Westlands, Nairobi" value={formData.address} onChange={update("address")} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={update("password")}
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl pr-10 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mt-7 mb-4">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-xs text-white/25 font-medium">or continue with</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  {/* Social buttons */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => { window.location.href = `${API_BASE_URL}/auth/oauth/google?redirect_to=${encodeURIComponent(window.location.origin)}`; }}
                      className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/75 hover:text-white text-sm font-semibold transition-all duration-200"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GoogleIcon />
                      Google
                    </motion.button>
                    <motion.button
                      onClick={() => { window.location.href = `${API_BASE_URL}/auth/oauth/facebook?redirect_to=${encodeURIComponent(window.location.origin)}`; }}
                      className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/75 hover:text-white text-sm font-semibold transition-all duration-200"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FacebookIcon />
                      Facebook
                    </motion.button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Upload ID ── */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-black text-white">Upload ID document</h1>
                  <p className="text-sm text-white/40 mt-1.5">National ID, passport or business permit.</p>
                  <label className="mt-7 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/12 p-12 cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 group">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                      <Upload className="h-7 w-7 text-white/30 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-white/70 group-hover:text-white transition-colors">Click to upload or drag and drop</p>
                      <p className="text-xs text-white/30 mt-1">JPEG, PNG, PDF — max 10 MB</p>
                    </div>
                    <input type="file" className="sr-only" />
                  </label>
                </div>
              )}

              {/* ── Step 3: Success ── */}
              {step === 3 && (
                <div className="text-center py-8">
                  <motion.div
                    className="inline-flex h-16 w-16 rounded-full bg-emerald-500/15 items-center justify-center mb-5"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  >
                    <Check className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h1 className="text-2xl font-black text-white">Awaiting verification</h1>
                  <p className="text-sm text-white/45 mt-2.5 max-w-sm mx-auto leading-relaxed">
                    Thanks for signing up. Our team typically reviews new accounts within 24 hours. You'll receive an email once verified.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11 px-6 shadow-lg shadow-emerald-500/20">
                      <Link to="/dashboard/producer">Preview dashboard <ArrowRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-11 px-6">
                      <Link to="/">Back to homepage</Link>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation footer */}
          {step < 3 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex justify-between items-center border-t border-white/5 pt-5">
              <Button
                variant="ghost"
                onClick={() => { setStep(Math.max(0, step - 1)); setError(""); }}
                disabled={step === 0}
                className="text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleNext}
                  disabled={(step === 0 && !role) || loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-10 px-6 shadow-lg shadow-emerald-500/20 disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Creating account…
                    </span>
                  ) : step === 1 ? (
                    <>Create Account <ArrowRight className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Continue <ArrowRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/20 mt-6 flex items-center justify-center gap-1.5">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400/70 hover:text-emerald-400 transition-colors font-semibold">Sign in</Link>
        </p>
        <p className="text-center text-xs text-white/15 mt-3 flex items-center justify-center gap-1.5">
          <Leaf className="h-3 w-3 text-emerald-700" />
          Powering Africa's circular economy
        </p>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", value, onChange }: {
  label: string; placeholder: string; type?: string;
  value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
      />
    </div>
  );
}