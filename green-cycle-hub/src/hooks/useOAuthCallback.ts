import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getDashboardRoute } from '@/lib/api';

export function useOAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL fragment for OAuth tokens from Supabase
    const fragment = window.location.hash.substring(1);
    if (!fragment) return;

    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const error = params.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      // Clear fragment and stay on current page (user will see error)
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (!accessToken) return;

    console.log('OAuth callback: token received, saving to localStorage');

    // Save tokens to localStorage
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    if (expiresIn) {
      const expiresAt = new Date().getTime() + parseInt(expiresIn) * 1000;
      localStorage.setItem('token_expires_at', expiresAt.toString());
    }

    const fetchUser = async () => {
      try {
        const user = await getCurrentUser(accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        navigate(getDashboardRoute(user?.role || 'learner'));
      } catch (fetchError) {
        console.error('Failed to fetch user:', fetchError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    // Fetch user data and route to the correct dashboard
    fetchUser();

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [navigate]);
}
