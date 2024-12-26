import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../../models/author.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { RestService } from './abstract.service';

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

  find(query: string, startFrom = 0, pageSize = 20) {
    let params: HttpParams = new HttpParams().set('q', query);
    if (startFrom && startFrom > 0) {
      params = params.set('from', startFrom);
    }
    if (pageSize && pageSize > 0) {
      params = params.set('size', pageSize);
    }
    return this.http.get<PaginatedResponse<Author>>(this.apiUrl('search'), { params });
  }

  setMainVariant(authorId: string, mainVariantId: string) {
    const requestBody: Partial<Author> = {
      mainVariantId: mainVariantId,
    };
    return this.http.put<Author>(this.apiUrl([authorId, 'main-variant']), requestBody);
  }
}
