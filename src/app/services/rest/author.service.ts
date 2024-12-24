import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {

  private http = inject(HttpClient);

  find(query: string) {
    const params: HttpParams = new HttpParams().set('q', query);

    return this.http.get<any[]>('http://localhost:3000/authors/search', { params });
  }

}
