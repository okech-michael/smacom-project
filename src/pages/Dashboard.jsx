import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import WasteProducerDashboard from '@/components/dashboards/WasteProducerDashboard';
import BioProcessorDashboard from '@/components/dashboards/BioProcessorDashboard';
import FarmerDashboard from '@/components/dashboards/FarmerDashboard';
import LearnerDashboard from '@/components/dashboards/LearnerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import InvalidRoleState from '@/components/InvalidRoleState';
import { dashboardRoleFor, ROLES } from '@/lib/roles';

export default function Dashboard() {
  const { user } = useAuth();
  const role = dashboardRoleFor(user?.role);

  const dashboards = {
    [ROLES.WASTE_PRODUCER]: WasteProducerDashboard,
    [ROLES.BIO_PROCESSOR]: BioProcessorDashboard,
    [ROLES.FARMER]: FarmerDashboard,
    [ROLES.LEARNER]: LearnerDashboard,
    [ROLES.ADMIN]: AdminDashboard,
  };

  const DashboardComponent = role ? dashboards[role] : null;
  if (!DashboardComponent) return <InvalidRoleState />;
  return <DashboardComponent user={user} />;
}