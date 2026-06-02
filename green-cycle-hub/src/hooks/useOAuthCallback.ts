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

    // Clear fragment from URL immediately
    window.history.replaceState({}, document.title, window.location.pathname);

    // Fetch user data and route to the correct dashboard
    const fetchUserAndNavigate = async () => {
      try {
        const user = await getCurrentUser(accessToken);
        if (user && user.id) {
          localStorage.setItem('user', JSON.stringify(user));
          navigate(getDashboardRoute(user.role || 'learner'));
        } else {
          // If user data is invalid, still navigate but to learner dashboard
          console.warn('User data is invalid, navigating to learner dashboard');
          navigate('/dashboard/learner');
        }
      } catch (fetchError) {
        console.error('Failed to fetch user:', fetchError);
        // Navigate to learner dashboard anyway - user data will be fetched by dashboard component
        navigate('/dashboard/learner');
      }
    };

    fetchUserAndNavigate();
  }, [navigate]);
}
