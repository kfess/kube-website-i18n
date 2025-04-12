import { Language } from './languages';

// コミット情報の型
type Commit = {
  hash: string;
  date: string;
  message: string;
  author: string;
};

type NonExistentTranslation = {
  exists: false;
};

type ExistentTranslation = {
  exists: true;
  path?: string;
  commits?: Commit[];
};

type TranslationInfo = NonExistentTranslation | ExistentTranslation;

export type TranslationState = {
  [key: string]: {
    translations: {
      [lang in Language]: TranslationInfo;
    };
  };
};

export const contentTypes = [
  'Docs',
  'Blog',
  'Community',
  'Case-study',
  'Example',
  'Include',
  // 'Partner', // For now, we don't have any partner content in markdown
  'Release',
  'Training',
] as const;
export type ContentType = (typeof contentTypes)[number];

export const docsSubContentTypes = [
  'Getting Started',
  'Concepts',
  'Tasks',
  'Tutorials',
  'Reference',
  'Contribute',
] as const;
export type DocsSubContentType = (typeof docsSubContentTypes)[number];
