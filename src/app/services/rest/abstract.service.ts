import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export abstract class RestService {
  protected http = inject(HttpClient);

  protected readonly baseUrl = environment.apiBaseUrl;

  protected constructor(protected readonly resource: string) { }

  apiUrl(path?: string | string[]) {
    const segments = [this.baseUrl, this.resource];
    if (path && typeof path === 'string') {
      segments.push(path);
    } else if (Array.isArray(path)) {
      segments.push(...path);
    }
    return segments.join('/');
  }
}
