import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/smacom/Logo";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/40">
      <Card className="w-full max-w-md p-8 shadow-sm">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sign in to your SMACOM account</p>
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground bg-secondary/50">
            Two-factor verification will appear after sign-in (placeholder).
          </div>
          <Button type="submit" className="w-full" size="lg">Sign in</Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-6">
          New to SMACOM? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
