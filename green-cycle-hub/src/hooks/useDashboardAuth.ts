import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser, getCurrentUser, getDashboardRoute } from "@/lib/api";

export function useDashboardAuth(expectedRole: string) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      navigate('/login');
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        console.log('useDashboardAuth: loading user with token');
        const currentUser = await getCurrentUser(token);
        console.log('useDashboardAuth: user loaded', currentUser?.id, currentUser?.role);
        
        if (!currentUser || !currentUser.id) {
          console.error('useDashboardAuth: Invalid user session - no id');
          if (!cancelled) {
            setLoading(false);
            // Don't redirect immediately - allow dashboard to render
          }
          return;
        }

        if (currentUser.role && currentUser.role !== expectedRole) {
          console.log('useDashboardAuth: role mismatch, redirecting to', currentUser.role);
          navigate(getDashboardRoute(currentUser.role));
          return;
        }

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('useDashboardAuth: error loading user', error);
        // Don't clear token or redirect - just set loading to false
        // This allows the dashboard to render even if user fetch fails
        // The dashboard can retry or handle missing data gracefully
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [navigate, expectedRole]);

  return { user, loading };
}
