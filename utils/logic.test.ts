import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  validateEmail,
  validateStep,
  calculateProjectEstimate,
  getFormattedStudioTime
} from './logic';
import { Project } from '../types/portfolio';

const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'iquine',
    title: 'Iquine',
    client: 'Iquine Paints',
    year: '2026',
    category: 'Web & Platforms',
    tags: ['UX/UI Design', 'Front-End Dev'],
    headline: 'Elevating Iquine’s online experience',
    summary: 'A scalable customer-first platform.',
    challenge: 'Legacy system',
    solution: 'Modern stack',
    results: ['200% traffic increase'],
    coverImage: '/images/iquine.jpg',
    galleryImages: [],
    featured: true,
    accentColor: '#3b82f6',
    role: ['Front-end', 'Design System']
  },
  {
    id: '2',
    slug: 'amanda-braga',
    title: 'Amanda Braga',
    client: 'Amanda Braga',
    year: '2025',
    category: 'Immersive & 3D',
    tags: ['Art Direction', 'WebGL'],
    headline: 'Designing a bold scrolling experience',
    summary: 'Recognized by Awwwards and FWA.',
    challenge: 'High visual performance',
    solution: 'Custom smooth scroll and shaders',
    results: ['Site of the Day'],
    coverImage: '/images/braga.jpg',
    galleryImages: [],
    featured: true,
    accentColor: '#f97316',
    role: ['Creative Development', 'WebGL']
  }
];

test('filterProjects filters by category correctly', () => {
  const resultAll = filterProjects(mockProjects, 'All');
  assert.equal(resultAll.length, 2);

  const result3D = filterProjects(mockProjects, 'Immersive & 3D');
  assert.equal(result3D.length, 1);
  assert.equal(result3D[0].slug, 'amanda-braga');

  const resultEmpty = filterProjects(mockProjects, 'Mobile Apps');
  assert.equal(resultEmpty.length, 0);
});

test('filterProjects searches across title, client, and tags', () => {
  const resByTag = filterProjects(mockProjects, 'All', 'webgl');
  assert.equal(resByTag.length, 1);
  assert.equal(resByTag[0].title, 'Amanda Braga');

  const resByTitle = filterProjects(mockProjects, 'All', 'iquine');
  assert.equal(resByTitle.length, 1);
  assert.equal(resByTitle[0].title, 'Iquine');
});

test('validateEmail checks standard email syntax', () => {
  assert.equal(validateEmail('test@cappen.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
});

test('validateStep validates form inputs per step', () => {
  const data = {
    name: '',
    email: '',
    projectType: '',
    budget: '',
    note: ''
  };

  // Step 1: name
  assert.equal(validateStep(1, data).isValid, false);
  data.name = 'Alex';
  assert.equal(validateStep(1, data).isValid, true);

  // Step 2: email
  assert.equal(validateStep(2, data).isValid, false);
  data.email = 'alex@example.com';
  assert.equal(validateStep(2, data).isValid, true);

  // Step 3: project type
  assert.equal(validateStep(3, data).isValid, false);
  data.projectType = 'immersive experience';
  assert.equal(validateStep(3, data).isValid, true);

  // Step 4: budget
  assert.equal(validateStep(4, data).isValid, false);
  data.budget = '50k to 100k';
  assert.equal(validateStep(4, data).isValid, true);
});

test('calculateProjectEstimate assigns timeline and team based on project requirements', () => {
  const est = calculateProjectEstimate('immersive experience 3D', 'over 100k');
  assert.equal(est.timeline, '8-14 weeks');
  assert.ok(est.recommendedTeam.includes('3D Technical Artist'));
  assert.ok(est.recommendedTeam.includes('Dedicated Producer'));
});

test('getFormattedStudioTime returns 24h formatted time for valid timezone', () => {
  const time = getFormattedStudioTime('America/New_York');
  assert.match(time, /^\d{2}:\d{2}$/);
});
