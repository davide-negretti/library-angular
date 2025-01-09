import { AuthorNameVariant } from '../models/author.model';

export interface AuthorSearchResultDto {
  _id: string;
  mainNameVariant: AuthorNameVariant;
}
