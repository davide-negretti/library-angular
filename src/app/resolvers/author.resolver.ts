import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorService } from '../services/rest/author.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authorResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const id = route.paramMap.get('id');
  if (!id) throw Error('Author\'s ID not specified');
  return inject(AuthorService).getById(id);
};
