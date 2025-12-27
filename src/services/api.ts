import type {
  CV,
  Template,
  TemplateCategory,
  PaymentIntent,
  UploadResponse,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Project,
  Publication,
  Award,
  Volunteer,
  Interest,
  Reference,
  CustomSection,
  CVCustomization,
} from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cv-generator.brightkyefoo.cm/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'secret-api-key-please-changeme';

// Base URL without /api for static files
const getBaseUrl = () => {
  const url = API_BASE_URL.replace(/\/api$/, '');
  return url;
};

// Helper to get full asset URL (for images, previews, etc.)
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Build URL with base and optional API key
  const baseUrl = getBaseUrl();
  const separator = path.includes('?') ? '&' : '?';
  return `${baseUrl}${path}${API_KEY ? `${separator}api_key=${API_KEY}` : ''}`;
};

// Session management
const SESSION_KEY = 'cv_session_id';

export const getSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
};

export const setSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, sessionId);
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionId = getSessionId();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
    ...(sessionId && { 'X-Session-Id': sessionId }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Store session ID from response header
  const responseSessionId = response.headers.get('X-Session-Id');
  if (responseSessionId) {
    setSessionId(responseSessionId);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Templates API
export const templatesApi = {
  getAll: () => apiRequest<Template[]>('/templates'),

  getById: (id: string) => apiRequest<Template>(`/templates/${id}`),

  getByCategory: (category: TemplateCategory) =>
    apiRequest<Template[]>(`/templates/category/${category}`),

  getPreviewImage: (id: string): string =>
    `${API_BASE_URL}/templates/${id}/preview-image${API_KEY ? `?api_key=${API_KEY}` : ''}`,
};

// CV API
export const cvApi = {
  create: (data: { title: string; templateId: string }) =>
    apiRequest<CV>('/cv', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBySession: () => apiRequest<CV>('/cv/session'),

  getById: (id: string) => apiRequest<CV>(`/cv/${id}`),

  updatePersonalInfo: (id: string, data: Partial<PersonalInfo>) =>
    apiRequest<CV>(`/cv/${id}/personal-info`, {
      method: 'PATCH',
      body: JSON.stringify({ personalInfo: data }),
    }),

  updateSummary: (id: string, summary: string) =>
    apiRequest<CV>(`/cv/${id}/summary`, {
      method: 'PATCH',
      body: JSON.stringify({ summary }),
    }),

  updateObjective: (id: string, objective: string) =>
    apiRequest<CV>(`/cv/${id}/objective`, {
      method: 'PATCH',
      body: JSON.stringify({ objective }),
    }),

  updateExperiences: (id: string, experiences: Experience[]) =>
    apiRequest<CV>(`/cv/${id}/experiences`, {
      method: 'PATCH',
      body: JSON.stringify({ experiences }),
    }),

  updateEducation: (id: string, education: Education[]) =>
    apiRequest<CV>(`/cv/${id}/education`, {
      method: 'PATCH',
      body: JSON.stringify({ education }),
    }),

  updateSkills: (id: string, skills: Skill[]) =>
    apiRequest<CV>(`/cv/${id}/skills`, {
      method: 'PATCH',
      body: JSON.stringify({ skills }),
    }),

  updateLanguages: (id: string, languages: Language[]) =>
    apiRequest<CV>(`/cv/${id}/languages`, {
      method: 'PATCH',
      body: JSON.stringify({ languages }),
    }),

  updateCertifications: (id: string, certifications: Certification[]) =>
    apiRequest<CV>(`/cv/${id}/certifications`, {
      method: 'PATCH',
      body: JSON.stringify({ certifications }),
    }),

  updateProjects: (id: string, projects: Project[]) =>
    apiRequest<CV>(`/cv/${id}/projects`, {
      method: 'PATCH',
      body: JSON.stringify({ projects }),
    }),

  updatePublications: (id: string, publications: Publication[]) =>
    apiRequest<CV>(`/cv/${id}/publications`, {
      method: 'PATCH',
      body: JSON.stringify({ publications }),
    }),

  updateAwards: (id: string, awards: Award[]) =>
    apiRequest<CV>(`/cv/${id}/awards`, {
      method: 'PATCH',
      body: JSON.stringify({ awards }),
    }),

  updateVolunteer: (id: string, volunteer: Volunteer[]) =>
    apiRequest<CV>(`/cv/${id}/volunteer`, {
      method: 'PATCH',
      body: JSON.stringify({ volunteer }),
    }),

  updateInterests: (id: string, interests: Interest[]) =>
    apiRequest<CV>(`/cv/${id}/interests`, {
      method: 'PATCH',
      body: JSON.stringify({ interests }),
    }),

  updateReferences: (id: string, references: Reference[]) =>
    apiRequest<CV>(`/cv/${id}/references`, {
      method: 'PATCH',
      body: JSON.stringify({ references }),
    }),

  updateCustomSections: (id: string, customSections: CustomSection[]) =>
    apiRequest<CV>(`/cv/${id}/custom-sections`, {
      method: 'PATCH',
      body: JSON.stringify({ customSections }),
    }),

  updateCustomization: (id: string, customization: Partial<CVCustomization>) =>
    apiRequest<CV>(`/cv/${id}/customization`, {
      method: 'PATCH',
      body: JSON.stringify({ customization }),
    }),

  getPreview: (id: string): string =>
    `${API_BASE_URL}/cv/${id}/preview${API_KEY ? `?api_key=${API_KEY}` : ''}`,

  getPreviewImage: (id: string): string =>
    `${API_BASE_URL}/cv/${id}/preview-image${API_KEY ? `?api_key=${API_KEY}` : ''}`,

  getPreviewImages: (id: string) =>
    apiRequest<{ pageCount: number; images: string[] }>(`/cv/${id}/preview-images`),

  getDownload: (id: string): string =>
    `${API_BASE_URL}/cv/${id}/download${API_KEY ? `?api_key=${API_KEY}` : ''}`,
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const sessionId = getSessionId();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: 'POST',
      headers: {
        ...(API_KEY && { 'X-API-Key': API_KEY }),
        ...(sessionId && { 'X-Session-Id': sessionId }),
      },
      body: formData,
    });

    // Store session ID from response header
    const responseSessionId = response.headers.get('X-Session-Id');
    if (responseSessionId) {
      setSessionId(responseSessionId);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  deleteImage: (id: string) =>
    apiRequest(`/uploads/image/${id}`, {
      method: 'DELETE',
    }),
};

// Payment API
export const paymentApi = {
  createIntent: (cvId: string) =>
    apiRequest<PaymentIntent>(`/payments/cv/${cvId}/intent`, {
      method: 'POST',
    }),
};
