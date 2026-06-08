import axios from 'axios';
import { appParams } from '@/lib/app-params';

const API_BASE_URL = import.meta.env.VITE_API_URL || appParams.appBaseUrl || 'http://localhost:4000/api';
const APP_ID = appParams.appId || 'smacom';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? window.localStorage?.getItem('token') : null;
  config.headers = config.headers || {};
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  if (APP_ID) {
    config.headers['X-App-Id'] = APP_ID;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response;
    const message = response?.data?.error || response?.data?.message || error.message;
    const err = new Error(message);
    err.status = response?.status;
    err.data = response?.data;
    return Promise.reject(err);
  }
);

const auth = {
  async loginViaEmailPassword(email, password) {
    const payload = typeof email === 'object' ? email : { email, password };
    const result = await api.post('/auth/login', payload);
    if (result?.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  },

  loginWithProvider(provider, redirectUrl) {
    window.location.href = `${API_BASE_URL}/auth/login/${provider}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  },

  async register(payload) {
    const body = typeof payload === 'object' ? payload : { email: payload, password: arguments[1] };
    return api.post('/auth/register', body);
  },

  async verifyOtp(payload) {
    const body = typeof payload === 'object' ? payload : { email: payload, otp_code: arguments[1] };
    const result = await api.post('/auth/verify-otp', body);
    if (result?.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  },

  async resendOtp(email) {
    return api.post('/auth/resend-otp', { email });
  },

  async resetPasswordRequest(email) {
    return api.post('/auth/reset-password-request', { email });
  },

  async resetPassword(payload) {
    return api.post('/auth/reset-password', payload);
  },

  async updateMe(data) {
    return api.put('/auth/me', data);
  },

  async me() {
    return api.get('/auth/me');
  },

  logout(redirectUrl) {
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('token');
    }
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  redirectToLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  setToken(token, saveToStorage = true) {
    if (token && typeof window !== 'undefined' && saveToStorage) {
      window.localStorage?.setItem('token', token);
    }
  },
};

const createEntityAPI = (entityName) => ({
  async list(sort = '-created_date', limit = 100) {
    return api.get(`/${entityName}`, { params: { sort, limit } });
  },

  async filter(query = {}, sort = '-created_date', limit = 100, skip = 0, fields = null) {
    const params = { sort, limit, skip };
    if (fields) {
      params.fields = Array.isArray(fields) ? fields.join(',') : fields;
    }
    return api.post(`/${entityName}/filter`, query, { params });
  },

  async get(id) {
    return api.get(`/${entityName}/${id}`);
  },

  async create(data) {
    return api.post(`/${entityName}`, data);
  },

  async update(id, data) {
    return api.patch(`/${entityName}/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/${entityName}/${id}`);
  },
});

const integrations = {
  Core: {
    async UploadFile({ file }) {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/integrations/core/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    async InvokeLLM({ prompt }) {
      return api.post('/integrations/core/invoke-llm', { prompt });
    },
  },
};

export const apiClient = {
  auth,
  entities: {
    User: createEntityAPI('User'),
    WasteReport: createEntityAPI('WasteReport'),
    Product: createEntityAPI('Product'),
    Order: createEntityAPI('Order'),
    Course: createEntityAPI('Course'),
    Lesson: createEntityAPI('Lesson'),
    Enrollment: createEntityAPI('Enrollment'),
    Notification: createEntityAPI('Notification'),
    Inventory: createEntityAPI('Inventory'),
    CreditWallet: createEntityAPI('CreditWallet'),
    Transaction: createEntityAPI('Transaction'),
    IoTDevice: createEntityAPI('IoTDevice'),
    SensorReading: createEntityAPI('SensorReading'),
    Subscription: createEntityAPI('Subscription'),
    OrderItem: createEntityAPI('OrderItem'),
  },
  integrations,
};

export const appId = APP_ID;
export const appBaseUrl = API_BASE_URL;
export const functionsVersion = appParams.functionsVersion;

