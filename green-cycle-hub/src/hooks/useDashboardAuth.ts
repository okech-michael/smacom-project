import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser, getCurrentUser, getDashboardRoute } from "@/lib/api";

export function useDashboardAuth(expectedRole: string) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
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
            setError('Failed to load user profile. Please log in again.');
            setLoading(false);
            // Don't redirect immediately - allow dashboard to show error
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
          setError(null);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile';
        console.error('useDashboardAuth: error loading user', error);
        if (!cancelled) {
          setError(`Authentication error: ${errorMessage}. Please try logging in again.`);
        }
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

  return { user, loading, error };
}
