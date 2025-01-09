import { AuthorNameVariant } from '../models/author.model';

export interface AuthorNameVariantSearchResultDto extends AuthorNameVariant {
  authorId: string;
}
