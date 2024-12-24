import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../../models/author.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http = inject(HttpClient);

  getById(id: string): Observable<Author> {
    return this.http.get<Author>('http://localhost:3000/authors/' + id);
  }

  find(query: string, startFrom = 0, pageSize = 20) {
    let params: HttpParams = new HttpParams().set('q', query);
    if (startFrom && startFrom > 0) {
      params = params.set('from', startFrom);
    }
    if (pageSize && pageSize > 0) {
      params = params.set('size', pageSize);
    }
    return this.http.get<PaginatedResponse<Author>>('http://localhost:3000/authors/search', { params });
  }
}
