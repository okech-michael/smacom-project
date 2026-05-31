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
        const currentUser = await getCurrentUser(token);
        if (!currentUser || !currentUser.role) {
          throw new Error('Invalid user session');
        }

        if (currentUser.role !== expectedRole) {
          navigate(getDashboardRoute(currentUser.role));
          return;
        }

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        if (!cancelled) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/login');
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
  }, [expectedRole, navigate]);

  return { user, loading };
}
