export interface AuthorNameVariant {
  display: string;
  sorting: string;
  type: AuthorNameVariantType;
  localization: AuthorNameVariantLocalization;
  script: string | undefined;
  language: string | undefined;
  _id: string;
}

export interface Author {
  mainVariantId: string;
  nameVariants: AuthorNameVariant[];
  type: AuthorType;
  _id: string;
}

export enum AuthorType {
  PERSON = 'person',
  CORPORATE = 'corporate',
  COLLECTIVE = 'collective',
}

export enum AuthorNameVariantType {
  ORIGINAL = 'original',
  SHORT = 'short',
  PSEUDONYM = 'pseudonym',
}

export enum AuthorNameVariantLocalization {
  ORIGINAL = 'original',
  TRANSLATED = 'translated',
  TRANSLITERATED = 'transliterated',
}
