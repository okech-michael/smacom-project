import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import WasteProducerDashboard from '@/components/dashboards/WasteProducerDashboard';
import BioProcessorDashboard from '@/components/dashboards/BioProcessorDashboard';
import FarmerDashboard from '@/components/dashboards/FarmerDashboard';
import LearnerDashboard from '@/components/dashboards/LearnerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || 'waste_producer';

  const dashboards = {
    waste_producer: WasteProducerDashboard,
    bio_processor: BioProcessorDashboard,
    farmer: FarmerDashboard,
    learner: LearnerDashboard,
    admin: AdminDashboard,
  };

  const DashboardComponent = dashboards[role] || WasteProducerDashboard;
  return <DashboardComponent user={user} />;
}