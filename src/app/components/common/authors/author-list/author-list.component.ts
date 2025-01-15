import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { PaginatorModule } from 'primeng/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BehaviorSubject, take } from 'rxjs';
import { AuthorSearchResultDto } from '../../../../interfaces/dtos/author-search-result.dto';
import { AuthorNameVariant } from '../../../../interfaces/models/author.model';
import { AuthorService } from '../../../../services/rest/author.service';

interface FilteredAuthorSearchResult {
  _id: string;
  mainNameVariant: AuthorNameVariant;
  firstMatchingNameVariant?: AuthorNameVariant;
}

@Component({
  selector: 'l-author-list',
  imports: [PaginatorModule, TableModule, ButtonModule, ButtonGroupModule, AsyncPipe],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorListComponent implements OnChanges {
  readonly query = input<string>();
  readonly showInfoButton = input(false);
  readonly showSelectButton = input(false);

  @Output() showAuthorInfo = new EventEmitter<string>();
  @Output() selectAuthor = new EventEmitter<string>();
  @Output() unselectAuthor = new EventEmitter<string>();

  protected readonly rowsPerPageOptions = [5, 10, 20, 50];
  protected readonly defaultRows = 10;

  protected totalRecords = 0;
  protected selectedAuthors = new BehaviorSubject<string[]>([]);
  protected first = 0;
  protected rows = this.defaultRows;
  private readonly service = inject(AuthorService);
  private regExpArray: RegExp[] = [];
  private currentPageData = new BehaviorSubject<FilteredAuthorSearchResult[]>([]);

  protected currentPageData$ = this.currentPageData.asObservable();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'].currentValue !== changes['query'].previousValue) {
      this.onQueryChange(changes['query'].firstChange);
    }
  }

  private onQueryChange(isFirstChange: boolean): void {
    const firstPage: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
    };
    const query = this.query();
    if (query) {
      this.regExpArray = this.queryToRegExp(query);
    }
    if (!isFirstChange) {
      this.loadData(firstPage);
    }
  }

  private queryToRegExp(query: string): RegExp[] {
    if (query.trim().length) {
      const wordArray = query.split(' ');
      return wordArray.map(word => new RegExp(word.toLowerCase(), 'i'));
    } else {
      return [];
    }
  }

  loadData(loadEvent: TableLazyLoadEvent) {
    this.first = loadEvent.first ?? 0;
    this.rows = loadEvent.rows ?? this.defaultRows;

    this.service.findAuthors(this.query(), { from: this.first, pageSize: this.rows }).pipe(take(1)).subscribe((res) => {
      this.currentPageData.next(res.data.map(author => ({
        _id: author._id,
        mainNameVariant: author.mainNameVariant,
        firstMatchingNameVariant: this.getFirstMatchingVariant(author),
      })));
      this.totalRecords = res.pagination.totalCount;
    });
  }

  public resetSelectedAuthors() {
    this.selectedAuthors.next([]);
  }

  protected onShowAuthorInfo(_id: string) {
    this.showAuthorInfo.emit(_id);
  }

  protected onSelectAuthor(_id: string) {
    this.selectedAuthors.next([...this.selectedAuthors.getValue(), _id]);
    this.selectAuthor.emit(_id);
  }

  protected onUnselectAuthor(_id: string) {
    this.selectedAuthors.next([...this.selectedAuthors.getValue().filter(id => id !== _id)]);
    this.selectAuthor.emit(_id);
  }

  protected isSelectedAuthor(id: string) {
    return this.selectedAuthors.getValue().includes(id);
  }

  private getFirstMatchingVariant(author: AuthorSearchResultDto): AuthorNameVariant | undefined {
    const mainVariantMatches = this.regExpArray.every(regExp => regExp.test(author.mainNameVariant.display));
    const firstMatchingNameVariant = author.matchingNameVariants?.length ? author.matchingNameVariants[0] : undefined;
    return (!mainVariantMatches && firstMatchingNameVariant) ? firstMatchingNameVariant : undefined;
  }
}
