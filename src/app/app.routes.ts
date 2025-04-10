import { Routes } from '@angular/router';
import { AllAuthorsComponent } from './components/authors/all-authors/all-authors.component';
import { AuthorDetailsComponent } from './components/authors/author-details/author-details.component';
import { AuthorsComponent } from './components/authors/authors.component';
import { NewAuthorComponent } from './components/authors/new-author/new-author.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { authorResolver } from './resolvers/author.resolver';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'authors',
    component: AuthorsComponent,
    children: [
      {
        path: '',
        component: AllAuthorsComponent,
      },
      {
        path: 'new',
        component: NewAuthorComponent,
      },
      {
        path: ':id',
        component: AuthorDetailsComponent,
        resolve: {
          author: authorResolver,
        },
      },
    ],
  },

];
