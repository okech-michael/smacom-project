// On Vercel: Frontend and backend are on same domain
// Frontend served from root (/), API from /api/v1
// VITE_API_URL must be explicitly set for production builds on Vercel
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : '/api/v1'
);

const DASHBOARD_ROUTES: Record<string, string> = {
  producer: '/dashboard/producer',
  processor: '/dashboard/processor',
  farmer: '/dashboard/farmer',
  learner: '/dashboard/learner',
  admin: '/dashboard/admin',
};

const ROLE_LABELS: Record<string, string> = {
  producer: 'Waste Producer',
  processor: 'Bio-Processor',
  farmer: 'Farmer',
  learner: 'Learner',
  admin: 'Admin',
};

export function getDashboardRoute(role: string) {
  return DASHBOARD_ROUTES[role] ?? DASHBOARD_ROUTES.learner;
}

export function getRoleLabel(role: string) {
  return ROLE_LABELS[role] ?? `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
}

export function normalizeUserData(user: any) {
  if (!user) return null;
  if (typeof user === 'object' && 'data' in user) {
    return user.data;
  }
  return user;
}

export function saveAuthSession(response: { access_token: string; user: any }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', response.access_token || '');
  localStorage.setItem('user', JSON.stringify(normalizeUserData(response.user) ?? {}));
}

export async function signup(data: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: string;
  organisation?: string;
  address?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const payload = await response.json();
  return normalizeUserData(payload);
}
