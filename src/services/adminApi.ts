import type { CV } from '@/types/cv';
import type { AdminLoginRequest, AdminLoginResponse, AdminTemplate, CreateTemplateRequest } from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cv-generator.brightkyefoo.cm/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'secret-api-key-please-changeme';

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
    ...(API_KEY && { 'X-API-Key': API_KEY }),
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

// Admin Personal CV API
export const adminPersonalCVApi = {
  get: () => adminRequest<CV>('/admin/my-cv'),

  create: (data: Partial<CV>) =>
    adminRequest<CV>('/admin/my-cv', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (data: Partial<CV>) =>
    adminRequest<CV>('/admin/my-cv', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateSection: (section: string, data: unknown) =>
    adminRequest<CV>(`/admin/my-cv/${section}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  download: async (format: 'pdf' | 'png' = 'pdf'): Promise<Blob> => {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/admin/my-cv/download?format=${format}`, {
      headers: {
        ...(API_KEY && { 'X-API-Key': API_KEY }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download CV');
    }

    return response.blob();
  },
};
