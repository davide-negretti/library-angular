import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorListComponent } from '../../common/authors/author-list/author-list.component';

@Component({
  selector: 'l-all-authors',
  imports: [
    AuthorListComponent,
  ],
  templateUrl: './all-authors.component.html',
  styleUrl: './all-authors.component.scss',
})
export class AllAuthorsComponent {
  @Input() query: string | undefined; // from query parameter

  private router = inject(Router);

  async showAuthor($event: string) {
    await this.router.navigate(['authors', $event]);
  }
}
