import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProducerDashboard from "./pages/dashboards/ProducerDashboard";
import ProcessorDashboard from "./pages/dashboards/ProcessorDashboard";
import FarmerDashboard from "./pages/dashboards/FarmerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import LearnerDashboard from "./pages/dashboards/LearnerDashboard";

const queryClient = new QueryClient();

function AppContent() {
  // Handle OAuth callbacks (extracts token from URL fragment)
  useOAuthCallback();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/producer" element={<ProducerDashboard />} />
      <Route path="/dashboard/processor" element={<ProcessorDashboard />} />
      <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/learner" element={<LearnerDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
