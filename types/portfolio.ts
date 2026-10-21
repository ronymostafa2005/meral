export type ProjectCategory =
  | 'All'
  | 'Campaign Design'
  | 'Brand Voice'
  | 'Digital Experience'
  | 'Brand Strategy'
  | 'Web & Platforms'
  | 'Mobile Apps'
  | 'Immersive & 3D';

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  tags: string[];
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  awards?: string[];
  coverImage: string;
  galleryImages: string[];
  featured: boolean;
  accentColor: string;
  liveUrl?: string;
  role: string[];
}

export interface AwardItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  year: string;
}

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface BotFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  note: string;
}

export interface FormValidationResult {
  isValid: boolean;
  error?: string;
}
