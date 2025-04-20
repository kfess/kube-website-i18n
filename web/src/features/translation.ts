import { Language } from './languages';

// Summary
export type TranslationState = {
  [key: string]: { langs: Language[] };
};

// Detailed
type Commit = {
  hash: string;
  date: string;
  message: string;
  author: string;
};

type TranslationInfo = {
  path: string;
  commits: Commit[];
};

export type DetailedTranslationState = {
  [key: string]: Partial<Record<Language, TranslationInfo>>;
};

export const contentTypes = [
  'docs',
  'blog',
  'community',
  'case_study',
  'example',
  'include',
  'release',
  'partner',
  'training',
] as const;
export type ContentType = (typeof contentTypes)[number];

export const docsSubContentTypes = [
  'concept',
  'task',
  'tutorial',
  'reference',
  'contribute',
] as const;
export type DocsSubContentType = (typeof docsSubContentTypes)[number];
