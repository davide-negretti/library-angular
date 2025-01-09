import { Routes } from '@angular/router';
import { AuthorDetailsComponent } from './components/authors/author-details/author-details.component';
import { AuthorListComponent } from './components/authors/author-list/author-list.component';
import { AuthorsComponent } from './components/authors/authors.component';
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
        component: AuthorListComponent,
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
