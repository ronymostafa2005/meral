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
  clientLogo?: string;
}

/**
 * A single entry in the full project archive shown beneath the featured work.
 * Lighter than `Project`: no case study, just the cover set and the two titles
 * the card prints side by side.
 */
export interface ArchiveItem {
  id: string;
  /** English title, printed on the left of the card. */
  title: string;
  /** Arabic title, printed on the right. Optional — the card drops it if empty. */
  titleAr: string;
  category: string;
  description: string;
  /** First image is the cover; the count renders as the "N frames" badge. */
  images: string[];
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
