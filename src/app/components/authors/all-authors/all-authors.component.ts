import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  async showAuthor($event: string) {
    await this.router.navigate([$event], { relativeTo: this.route });
  }
}
