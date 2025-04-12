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

export const documentTypes = [
  'docs',
  'blog',
  'community',
  'case-study',
  'example',
  'include',
  'partner',
  'release',
  'training',
];
export type DocumentType = (typeof documentTypes)[number];
