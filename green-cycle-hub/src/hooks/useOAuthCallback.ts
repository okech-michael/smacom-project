import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // Fetch user data and save to localStorage
    const fetchUser = async () => {
      try {
        const apiUrl = window.location.pathname.includes('/api/') 
          ? '/api/v1/auth/me'
          : new URL('/api/v1/auth/me', window.location.origin).toString();
        
        console.log('Fetching user from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const user = await response.json();
          console.log('User fetched successfully:', user);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          console.warn('Failed to fetch user. Status:', response.status);
          // Still redirect even if user fetch fails, token is already saved
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Still redirect even if fetch fails, token is already saved
      }
    };

    // Fetch user data
    fetchUser();

    // Clear the fragment and redirect to dashboard
    console.log('Redirecting to dashboard');
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate('/dashboard/learner');
  }, [navigate]);
}
