import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorListComponent } from '../../common/authors/author-list/author-list.component';

@Component({
  selector: 'l-all-authors',
  imports: [
    AuthorListComponent,
  ],
  templateUrl: './all-authors.component.html',
  styleUrl: './all-authors.component.css',
})
export class AllAuthorsComponent {
  readonly query = input<string>(); // from query parameter

  private router = inject(Router);

  async showAuthor($event: string) {
    await this.router.navigate(['authors', $event]);
  }
}
