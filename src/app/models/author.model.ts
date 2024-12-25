export interface AuthorNameVariant {
  display: string;
  sorting: string;
  type: string;
  _id: string;
}

export interface Author {
  mainVariantId: string;
  nameVariants: AuthorNameVariant[];
  _id: string;
}
