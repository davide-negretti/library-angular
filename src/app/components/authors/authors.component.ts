import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { AuthorsToolbarComponent } from '../common/authors/authors-toolbar/authors-toolbar.component';

@Component({
  selector: 'l-authors',
  imports: [
    RouterOutlet,
    AuthorsToolbarComponent,
  ],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  async onSearch(query: string) {
    const params: Params = { query };
    await this.router.navigate(['authors'], { queryParams: params });
  }
}
