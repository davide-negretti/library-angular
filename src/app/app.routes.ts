import { Routes } from '@angular/router';
import { AuthorsComponent } from './components/authors/authors.component';
import { HomePageComponent } from './components/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'authors', component: AuthorsComponent },
];
