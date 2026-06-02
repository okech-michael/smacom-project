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
    const errorDescription = params.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      // Clear fragment and redirect to login
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/login');
      return;
    }

    if (!accessToken) return;

    console.log('OAuth callback: token received, saving to localStorage');

    // Save tokens to localStorage FIRST
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    if (expiresIn) {
      const expiresAt = new Date().getTime() + parseInt(expiresIn) * 1000;
      localStorage.setItem('token_expires_at', expiresAt.toString());
    }

    // Clear fragment from URL immediately (use replace instead of replaceState for safety)
    const newUrl = window.location.pathname + window.location.search;
    window.history.replaceState({ path: newUrl }, '', newUrl);

    // Fetch user data and route to the correct dashboard
    const fetchUserAndNavigate = async () => {
      try {
        console.log('Fetching user with token:', accessToken.substring(0, 20) + '...');
        const user = await getCurrentUser(accessToken);
        console.log('User fetched successfully:', user?.id, user?.role);
        
        if (user && user.id) {
          localStorage.setItem('user', JSON.stringify(user));
          const dashboardRoute = getDashboardRoute(user.role || 'learner');
          console.log('Navigating to:', dashboardRoute);
          navigate(dashboardRoute);
        } else {
          console.warn('User data is invalid, navigating to learner dashboard');
          navigate('/dashboard/learner');
        }
      } catch (fetchError) {
        console.error('Failed to fetch user:', fetchError);
        // Still try to navigate - the dashboard will handle token validation
        console.log('Navigating to learner dashboard despite fetch error');
        navigate('/dashboard/learner');
      }
    };

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(fetchUserAndNavigate, 50);
  }, [navigate]);
}
