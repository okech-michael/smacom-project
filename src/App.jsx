import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Onboarding from '@/pages/Onboarding';
import ReportWaste from '@/pages/waste/ReportWaste';
import MyPickups from '@/pages/waste/MyPickups';
import Marketplace from '@/pages/Marketplace';
import ProductDetail from '@/pages/marketplace/ProductDetail';
import Orders from '@/pages/Orders';
import CourseCatalog from '@/pages/learning/CourseCatalog';
import CourseDetail from '@/pages/learning/CourseDetail';
import MyCourses from '@/pages/learning/MyCourses';
import Certificates from '@/pages/learning/Certificates';
import PickupRequests from '@/pages/processor/PickupRequests';
import InventoryPage from '@/pages/processor/InventoryPage';
import ProcessorProducts from '@/pages/processor/ProcessorProducts';
import Earnings from '@/pages/processor/Earnings';
import AIAdvisor from '@/pages/AIAdvisor';
import Wallet from '@/pages/Wallet';
import Notifications from '@/pages/Notifications';
import IoTDashboard from '@/pages/IoTDashboard';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/admin/UserManagement';
import AdminWaste from '@/pages/admin/AdminWaste';
import AdminFinances from '@/pages/admin/AdminFinances';
import AdminEnvironment from '@/pages/admin/AdminEnvironment';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminMarketplace from '@/pages/admin/AdminMarketplace';
import AdminCourses from '@/pages/admin/AdminCourses';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading SMACOM Solutions...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Waste Producer */}
          <Route path="/waste/report" element={<ReportWaste />} />
          <Route path="/waste/pickups" element={<MyPickups />} />
          <Route path="/wallet" element={<Wallet />} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<Orders />} />

          {/* LMS */}
          <Route path="/learning" element={<CourseCatalog />} />
          <Route path="/learning/course/:id" element={<CourseDetail />} />
          <Route path="/learning/my-courses" element={<MyCourses />} />
          <Route path="/learning/certificates" element={<Certificates />} />

          {/* Bio Processor */}
          <Route path="/processor/pickups" element={<PickupRequests />} />
          <Route path="/processor/inventory" element={<InventoryPage />} />
          <Route path="/processor/products" element={<ProcessorProducts />} />
          <Route path="/processor/earnings" element={<Earnings />} />

          {/* AI & IoT */}
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/iot" element={<IoTDashboard />} />

          {/* Admin */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/waste" element={<AdminWaste />} />
          <Route path="/admin/marketplace" element={<AdminMarketplace />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/iot" element={<IoTDashboard />} />
          <Route path="/admin/finances" element={<AdminFinances />} />
          <Route path="/admin/environment" element={<AdminEnvironment />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />

          {/* Common */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;