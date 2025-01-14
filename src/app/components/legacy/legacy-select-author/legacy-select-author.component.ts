import { Component, signal } from '@angular/core';
import { AuthorNameVariantsComponent } from '../../common/authors/author-name-variants/author-name-variants.component';
import { CreateAuthorComponent } from '../../common/authors/create-author/create-author.component';
import { LegacySearchAuthorComponent } from '../legacy-search-author/legacy-search-author.component';

enum SelectAuthorStep {
  SEARCH,
  INSERT,
  REVIEW,
  CONFIRM,
}

/*
Workflow:
Search > Add new > Confirm
Search > Review > Confirm
 */

@Component({
  selector: 'l-legacy-select-author',
  standalone: true,
  imports: [
    AuthorNameVariantsComponent,
    LegacySearchAuthorComponent,
    CreateAuthorComponent,
  ],
  templateUrl: './legacy-select-author.component.html',
  styleUrl: './legacy-select-author.component.scss',
})
export class LegacySelectAuthorComponent {
  step = signal(SelectAuthorStep.SEARCH);

  protected readonly SelectAuthorStep = SelectAuthorStep;

  protected selectedAuthorId: string | undefined;
  private searchQuery: string | undefined;

  onAuthorSelected($event: string) {
    this.selectedAuthorId = $event;
    this.step.set(SelectAuthorStep.REVIEW);
  }

  onAddNewAuthor($event: string) {
    this.searchQuery = $event;
    this.step.set(SelectAuthorStep.INSERT);
  }
}
