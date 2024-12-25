import { Component, signal } from '@angular/core';
import { SearchAuthorComponent } from '../forms/authors/search-author/search-author.component';

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
  selector: 'l-select-author',
  standalone: true,
  imports: [
    SearchAuthorComponent,
  ],
  templateUrl: './select-author.component.html',
  styleUrl: './select-author.component.scss',
})
export class SelectAuthorComponent {
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
