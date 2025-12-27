import type { CV } from '@/types/cv';
import type { AdminLoginRequest, AdminLoginResponse, AdminTemplate, CreateTemplateRequest } from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cv-generator.brightkyefoo.cm/api';

// Admin token management
const ADMIN_TOKEN_KEY = 'admin_token';

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const removeAdminToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// Admin API request helper
async function adminRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Admin Auth API
export const adminAuthApi = {
  login: (data: AdminLoginRequest) =>
    adminRequest<AdminLoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => {
    removeAdminToken();
  },
};

// Admin Templates API
export const adminTemplatesApi = {
  getAll: () => adminRequest<AdminTemplate[]>('/admin/templates'),

  create: (data: CreateTemplateRequest) =>
    adminRequest<AdminTemplate>('/admin/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateTemplateRequest>) =>
    adminRequest<AdminTemplate>(`/admin/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deactivate: (id: string) =>
    adminRequest<void>(`/admin/templates/${id}`, {
      method: 'DELETE',
    }),

  regeneratePreview: (id: string) =>
    adminRequest<{ previewUrl: string }>(`/admin/templates/${id}/regenerate-preview`, {
      method: 'POST',
    }),
};

// Admin CVs API
export const adminCVsApi = {
  getAll: () => adminRequest<CV[]>('/admin/cvs'),
};

// App Settings types
export interface AppSettings {
  id: string;
  freeDownloads: boolean;
  updatedAt: string;
  updatedBy?: string;
}

// Admin Settings API
export const adminSettingsApi = {
  get: () => adminRequest<AppSettings>('/admin/settings'),

  update: (data: { freeDownloads?: boolean }) =>
    adminRequest<AppSettings>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
