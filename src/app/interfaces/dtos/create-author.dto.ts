export interface CreateAuthorDto {
  display: string;
  sorting: string;
  mainNameVariantType: string;
  authorType: string;
  localization: string;
  script: string | undefined;
  language: string | undefined;
}
