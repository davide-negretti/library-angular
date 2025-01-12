import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { authorResolver } from './author.resolver';

describe('authorResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => authorResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
