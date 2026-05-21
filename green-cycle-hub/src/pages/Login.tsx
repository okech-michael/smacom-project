import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/smacom/Logo";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Leaf } from "lucide-react";

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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleGoogleSignIn() {
    setGoogleLoading(true);
    // TODO: wire up real OAuth — e.g. signInWithGoogle() from your auth provider
    setTimeout(() => setGoogleLoading(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#050c08] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-900/15 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo + header */}
          <div className="flex justify-center mb-7">
            <Logo />
          </div>
          <h1 className="text-2xl font-black text-white text-center tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/45 text-center mt-1.5">Sign in to your SMACOM account</p>

          {/* Google button */}
          <div className="mt-8">
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {googleLoading ? (
                <svg className="h-4 w-4 animate-spin text-white/60" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Email / password form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-white/50 uppercase tracking-wider">Password</Label>
                <a href="#" className="text-xs text-emerald-400/80 hover:text-emerald-400 transition-colors font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl pr-10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
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

            {/* 2FA placeholder */}
            <div className="rounded-xl border border-dashed border-white/10 bg-white/3 p-3 text-xs text-white/30 flex items-start gap-2">
              <span className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px]">i</span>
              Two-factor verification will appear after sign-in.
            </div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                Sign in <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-center text-white/35 mt-6">
            New to SMACOM?{" "}
            <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/20 mt-5 flex items-center justify-center gap-1.5">
          <Leaf className="h-3 w-3 text-emerald-600" />
          Powering Africa's circular economy
        </p>
      </motion.div>
    </div>
  );
}