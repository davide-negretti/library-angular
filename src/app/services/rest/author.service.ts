import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorNameVariantSearchResultDto } from '../../interfaces/dtos/author-name-variant-search-result.dto';
import { AuthorSearchResultDto } from '../../interfaces/dtos/author-search-result.dto';
import { CreateAuthorDto } from '../../interfaces/dtos/create-author.dto';
import { Author, AuthorNameVariant } from '../../interfaces/models/author.model';
import { PaginatedResponse } from '../../interfaces/paginated-response.model';
import { PaginationParameters, RestService } from './abstract.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService extends RestService {
  constructor() {
    super('authors');
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(this.apiUrl(id));
  }

  saveNameVariant(authorId: string, variant: AuthorNameVariant) {
    return this.http.put<Author>(this.apiUrl([authorId, 'variants']), variant);
  }

  addNameVariant(authorId: string, variant: AuthorNameVariant) {
    return this.http.post<Author>(this.apiUrl([authorId, 'variants']), variant);
  }

  findAuthors(query = '', paginationParameters: PaginationParameters) {
    const params: HttpParams = new HttpParams({ fromObject: { ...paginationParameters } }).append('q', query);
    return this.http.get<PaginatedResponse<AuthorSearchResultDto>>(this.apiUrl(), { params });
  }

  findAuthorNameVariants(query = '', paginationParameters: PaginationParameters) {
    const params: HttpParams = new HttpParams({ fromObject: { ...paginationParameters } }).append('q', query);
    return this.http.get<PaginatedResponse<AuthorNameVariantSearchResultDto>>(this.apiUrl('variants'), { params });
  }

  createAuthor(mainNameVariant: CreateAuthorDto) {
    return this.http.post<Author>(this.apiUrl(), mainNameVariant);
  }

  setMainVariant(authorId: string, mainVariantId: string) {
    const requestBody: Partial<Author> = {
      mainVariantId: mainVariantId,
    };
    return this.http.put<Author>(this.apiUrl([authorId, 'main-variant']), requestBody);
  }

  deleteNameVariant(authorId: string, variantId: string) {
    return this.http.delete<Author>(this.apiUrl([authorId, 'variants', variantId]));
  }
}
