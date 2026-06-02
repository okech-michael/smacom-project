import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser, getCurrentUser, getDashboardRoute } from "@/lib/api";

/**
 * Hook to protect admin pages from non-admin users
 * This provides frontend protection; backend must also verify
 */
export function useAdminProtection(): { user: AuthUser | null; isAdmin: boolean; loading: boolean } {
  const navigate = useNavigate();

  useEffect(() => {
    const protectAdminAccess = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const user = await getCurrentUser(token);

        if (!user) {
          throw new Error('No user found');
        }

        // Only allow admin role
        if (user.role !== 'admin') {
          // Redirect non-admin users to their appropriate dashboard
          navigate(getDashboardRoute(user.role));
          return;
        }
      } catch (error) {
        // Clear auth and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    protectAdminAccess();
  }, [navigate]);

  // Return null during verification
  return {
    user: null,
    isAdmin: false,
    loading: true
  };
}

/**
 * Hook to check if user is admin (without full protection)
 * Used for showing/hiding admin UI elements
 */
export function useIsAdmin(): boolean {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (!userStr || !token) return false;

  try {
    const user = JSON.parse(userStr) as AuthUser;
    return user.role === 'admin';
  } catch {
    return false;
  }
}
