// On Vercel: Frontend and backend are on same domain
// Frontend served from root (/), API from /api/v1
// VITE_API_URL must be explicitly set for production builds on Vercel
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : '/api/v1'
);

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  status?: string;
  organisation?: string;
  address?: string;
  [key: string]: unknown;
}

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

export function normalizeUserData(user: unknown): AuthUser | null {
  if (!user) return null;
  if (typeof user === 'object' && user !== null) {
    const record = user as Record<string, unknown>;
    if ('data' in record && typeof record.data === 'object' && record.data !== null) {
      return record.data as AuthUser;
    }
    return record as AuthUser;
  }
  return null;
}

export function saveAuthSession(response: { access_token: string; user: unknown }) {
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
  const url = `${API_BASE_URL}/auth/me`;
  console.log('getCurrentUser: fetching from', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('getCurrentUser: response status', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('getCurrentUser: error response', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid or expired authentication token');
      } else if (response.status === 404) {
        throw new Error('User profile not found');
      } else {
        throw new Error(`API error (${response.status}): Failed to fetch user`);
      }
    }

    const payload = await response.json();
    console.log('getCurrentUser: received payload', { success: !!payload, hasData: 'data' in payload });
    
    const user = normalizeUserData(payload);
    if (!user) {
      console.error('getCurrentUser: normalization failed', payload);
      throw new Error('Failed to parse user data');
    }
    
    console.log('getCurrentUser: success', user.id);
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('getCurrentUser: exception', message);
    throw error;
  }
}

// ============================================
// DASHBOARD DATA FETCHING FUNCTIONS
// ============================================

export interface DashboardStats {
  waste_collected?: number;
  compost_produced?: number;
  revenue?: number;
  active_users?: number;
  co2_saved?: number;
  environmental_score?: number;
}

export interface IoTUnit {
  id?: string;
  name: string;
  temp: number;
  moisture: number;
  co2: number;
  fill: number;
  stage: string;
  progress: number;
  status: 'optimal' | 'warning' | 'alert';
}

export interface Course {
  id?: string;
  title: string;
  instructor: string;
  duration: string;
  fee: string;
  category?: string;
  youtube_url?: string;
  description?: string;
  modules?: number;
}

export interface PickupRequest {
  id: string;
  producer: string;
  type: string;
  quantity: number;
  distance: number;
  address: string;
}

export interface Notification {
  id: number;
  title: string;
  time: string;
  level: 'info' | 'warning' | 'alert';
}

// Producer Dashboard APIs
export async function getProducerStats(token: string): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/waste/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const payload = await response.json();
    return payload.data ?? {};
  } catch {
    return {};
  }
}

export async function getPickupRequests(token: string): Promise<PickupRequest[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/waste/pickup-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch pickup requests');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

// Processor Dashboard APIs
export async function getIoTUnits(token: string): Promise<IoTUnit[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/iot/units`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch IoT units');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

// Farmer Dashboard APIs
export async function getMarketplaceProducts(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

// Learning APIs
export async function getCourses(token?: string): Promise<Course[]> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/learning/courses`, { headers });
    if (!response.ok) throw new Error('Failed to fetch courses');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export async function enrollCourse(token: string, courseId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/learning/enroll`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course_id: courseId }),
    });
    if (!response.ok) throw new Error('Failed to enroll');
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function getUserCourses(token: string): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user courses');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}

// Admin APIs
export async function getAdminStats(token: string): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    const payload = await response.json();
    return payload.data ?? {};
  } catch {
    return {};
  }
}

export async function createCourse(token: string, courseData: Course) {
  try {
    const response = await fetch(`${API_BASE_URL}/learning/courses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function getNotifications(token: string): Promise<Notification[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const payload = await response.json();
    return payload.data ?? [];
  } catch {
    return [];
  }
}
