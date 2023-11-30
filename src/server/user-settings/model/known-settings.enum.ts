export const KnownSettings = {
  language: 'language',
} as const;
export type KnownSettings = (typeof KnownSettings)[keyof typeof KnownSettings];
