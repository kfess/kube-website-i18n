export const LANGUAGES = {
  bn: 'Bengali',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  hi: 'Hindi',
  id: 'Indonesian',
  ja: 'Japanese',
  ko: 'Korean',
  pl: 'Polish',
  'pt-br': 'Portuguese(BR)',
  ru: 'Russian',
  uk: 'Ukrainian',
  'zh-cn': 'Chinese(CN)',
} as const;

export type Language = keyof typeof LANGUAGES;
