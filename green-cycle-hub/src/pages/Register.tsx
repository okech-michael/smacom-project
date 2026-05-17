import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/smacom/Logo";
import { ROLES, RoleId } from "@/lib/mock-data";
import { Check, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL, signup } from "@/lib/api";

const STEPS = ["Choose role", "Your details", "Upload ID", "Verification"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleId | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    organisation: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary/40 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex justify-center mb-8"><Logo /></div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2",
                  i < step ? "bg-primary text-primary-foreground border-primary" :
                  i === step ? "border-primary text-primary bg-background" :
                  "border-border text-muted-foreground bg-background"
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <Card className="p-6 sm:p-8 shadow-sm">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold">Choose your role</h1>
              <p className="text-sm text-muted-foreground mt-1">You can change this later from your account settings.</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-md border-2 text-left transition",
                      role === r.id ? "border-primary bg-accent" : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0", role === r.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")}>
                      <r.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold">Your details</h1>
              <p className="text-sm text-muted-foreground mt-1">Tell us a bit about yourself.</p>
              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => {
                  window.location.href = `${API_BASE_URL}/auth/oauth/google?redirect_to=${encodeURIComponent(window.location.origin)}`;
                }}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full mb-6"
                onClick={() => {
                  window.location.href = `${API_BASE_URL}/auth/oauth/facebook?redirect_to=${encodeURIComponent(window.location.origin)}`;
                }}
              >
                Continue with Facebook
              </Button>
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Field
                  label="Full name"
                  placeholder="Wanjiku Mwangi"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Field
                  label="Phone"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Field
                  label="Organisation (optional)"
                  placeholder="Green Grocer Market"
                  value={formData.organisation}
                  onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    placeholder="Westlands, Nairobi"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold">Upload ID document</h1>
              <p className="text-sm text-muted-foreground mt-1">National ID, passport or business permit.</p>
              <label className="mt-6 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-10 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, PDF — max 10MB</p>
                <input type="file" className="sr-only" />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 rounded-full bg-success/10 items-center justify-center mb-4">
                <Check className="h-7 w-7 text-success" />
              </div>
              <h1 className="text-2xl font-bold">Awaiting verification</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Thanks for signing up. Our admin team typically reviews new accounts within 24 hours. You'll receive an email once verified.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild><Link to="/dashboard/producer">Preview your dashboard</Link></Button>
                <Button asChild variant="outline"><Link to="/">Back to homepage</Link></Button>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => { setStep(Math.max(0, step - 1)); setError(""); }} disabled={step === 0}>Back</Button>
              <Button
                onClick={async () => {
                  if (step === 0 && !role) return;
                  
                  // Validate step 1
                  if (step === 1) {
                    if (!formData.email || !formData.password || !formData.full_name || !formData.phone) {
                      setError("Please fill in all required fields");
                      return;
                    }
                    if (formData.password.length < 6) {
                      setError("Password must be at least 6 characters");
                      return;
                    }
                  }

                  // Submit form on step 1
                  if (step === 1) {
                    setLoading(true);
                    setError("");
                    try {
                      await signup({
                        email: formData.email,
                        password: formData.password,
                        full_name: formData.full_name,
                        phone: formData.phone,
                        role: role!,
                        organisation: formData.organisation,
                        address: formData.address,
                      });
                      setStep(3); // Go to verification step
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Signup failed");
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={(step === 0 && !role) || loading}
              >
                {loading ? "Creating account..." : step === 1 ? "Create Account" : "Continue"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", value, onChange }: { label: string; placeholder: string; type?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input placeholder={placeholder} type={type} value={value} onChange={onChange} />
    </div>
  );
}
