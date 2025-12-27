import type { CV, Template, TemplateLanguage } from './cv';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    role: 'superadmin' | 'admin';
  };
}

export interface AdminTemplate extends Template {
  edgeCodes?: Record<TemplateLanguage | 'default', string>;
  isActive?: boolean;
}

export interface CreateTemplateRequest {
  name: string;
  description: string;
  category: Template['category'];
  defaultLanguage: TemplateLanguage;
  availableLanguages: TemplateLanguage[];
  features: Template['features'];
  defaultColors: Template['defaultColors'];
  availableFonts: string[];
  edgeCodes: Record<string, string>;
}
