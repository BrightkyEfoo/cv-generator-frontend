export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'portfolio'
  | 'behance'
  | 'dribbble'
  | 'medium'
  | 'stackoverflow'
  | 'other';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'other';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';

export type TemplateCategory = 'professional' | 'creative' | 'modern' | 'simple' | 'academic';

export type SectionLayout = 'list' | 'grid' | 'timeline';

export type FieldType = 'text' | 'textarea' | 'date' | 'url' | 'list' | 'rating';

export type SidebarPosition = 'left' | 'right';

export type HeaderStyle = 'centered' | 'left' | 'split';

export type DateFormat = 'MM/YYYY' | 'YYYY' | 'MMM YYYY' | 'MMMM YYYY';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;
  maritalStatus?: MaritalStatus;
  photoUrl?: string;
  socialLinks: SocialLink[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  honors?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: SkillLevel;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors?: string[];
  description?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  role: string;
  organization: string;
  cause?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface Interest {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relationship: string;
  isVisible: boolean;
}

export interface CustomFieldValue {
  id: string;
  label: string;
  type: FieldType;
  value: string | string[] | number;
  required: boolean;
}

export interface CustomSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  fields: CustomFieldValue[];
}

export interface CustomSection {
  id: string;
  name: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  layout: SectionLayout;
  items: CustomSectionItem[];
}

export interface SectionConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
}

export interface CVColors {
  primary: string;
  secondary: string;
  accent?: string;
  text: string;
  headings: string;
  background: string;
  dividers: string;
}

export interface CVTypography {
  headingFont: string;
  bodyFont: string;
  headingSize: number;
  bodySize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface CVSpacing {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionGap: number;
  itemGap: number;
}

export interface CVLayout {
  sections: SectionConfig[];
  sidebarSections: SectionConfig[];
  hasSidebar: boolean;
  sidebarPosition: SidebarPosition;
  headerStyle: HeaderStyle;
  dateFormat: DateFormat;
  showPageNumbers: boolean;
}

export interface CVCustomization {
  templateId: string;
  colors: CVColors;
  typography: CVTypography;
  spacing: CVSpacing;
  layout: CVLayout;
}

export interface CVMetadata {
  createdAt: Date | string;
  updatedAt: Date | string;
  version: number;
  lastExportedAt?: Date | string;
}

export interface CV {
  id: string;
  sessionId: string;
  title: string;
  personalInfo: PersonalInfo;
  summary?: string;
  objective?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  publications: Publication[];
  awards: Award[];
  volunteer: Volunteer[];
  interests: Interest[];
  references: Reference[];
  customSections: CustomSection[];
  customization: CVCustomization;
  metadata?: CVMetadata;
  isPaid: boolean;
  // Root-level timestamps from backend
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

export interface TemplateFeatures {
  hasPhoto: boolean;
  hasSidebar: boolean;
  hasColorCustomization: boolean;
  hasFontCustomization: boolean;
  maxSections: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: TemplateCategory;
  features: TemplateFeatures;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  availableFonts: string[];
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface UploadResponse {
  url: string;
  id: string;
}
