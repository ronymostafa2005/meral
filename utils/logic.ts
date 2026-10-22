import { BotFormData, FormValidationResult, Project } from '../types/portfolio';

export function filterProjects(
  projects: Project[],
  category: string,
  searchQuery: string = ''
): Project[] {
  let filtered = projects;

  if (category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query) ||
        p.headline.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return filtered;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateStep(step: number, data: BotFormData): FormValidationResult {
  switch (step) {
    case 1:
      if (!data.name.trim()) {
        return { isValid: false, error: 'Please enter your name.' };
      }
      if (data.name.trim().length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters.' };
      }
      return { isValid: true };
    case 2:
      if (!data.email.trim()) {
        return { isValid: false, error: 'Please enter your email.' };
      }
      if (!validateEmail(data.email)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
      }
      return { isValid: true };
    case 3:
      if (!data.projectType) {
        return { isValid: false, error: 'Please select a project type.' };
      }
      return { isValid: true };
    case 4:
      if (!data.budget) {
        return { isValid: false, error: 'Please select your budget range.' };
      }
      return { isValid: true };
    default:
      return { isValid: true };
  }
}

export function calculateProjectEstimate(projectType: string, budget: string): {
  timeline: string;
  recommendedTeam: string[];
} {
  let timeline = '4-8 weeks';
  let recommendedTeam = ['Lead Designer', 'Creative Developer'];

  if (projectType.includes('3D') || projectType.includes('Immersive')) {
    timeline = '8-14 weeks';
    recommendedTeam = ['Creative Director', '3D Technical Artist', 'WebGL Engineer'];
  } else if (projectType.includes('Mobile') || projectType.includes('Platform')) {
    timeline = '10-16 weeks';
    recommendedTeam = ['Product Strategist', 'Senior UI/UX Designer', 'Full-stack Engineer'];
  }

  if (budget === 'over 100k' || budget === '50k to 100k') {
    recommendedTeam.push('Dedicated Producer', 'QA Specialist');
  }

  return { timeline, recommendedTeam };
}

export function getFormattedStudioTime(timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(new Date());
  } catch {
    return '--:--';
  }
}
