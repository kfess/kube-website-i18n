export const LANGUAGES = {
  en: 'English',
  'zh-cn': 'Chinese(CN)',
  bn: 'Bengali',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  hi: 'Hindi',
  id: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  pl: 'Polish',
  'pt-br': 'Portuguese(BR)',
  ru: 'Russian',
  uk: 'Ukrainian',
  vi: 'Vietnamese',
} as const;

export type Language = keyof typeof LANGUAGES;
