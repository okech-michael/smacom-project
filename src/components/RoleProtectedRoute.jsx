import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import InvalidRoleState from '@/components/InvalidRoleState';
import UnauthorizedState from '@/components/UnauthorizedState';

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.role) {
    return <InvalidRoleState />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <UnauthorizedState />;
  }

  return <Outlet />;
}
