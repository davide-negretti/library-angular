import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  imports: [PaginatorModule, TableModule, ButtonModule, ButtonGroupModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnChanges {
  @Input() query: string | undefined;
  @Input() showInfoButton = false;
  @Input() showSelectButton = false;

  @Output() showAuthorInfo = new EventEmitter<string>();
  @Output() selectAuthor = new EventEmitter<string>();
  @Output() unselectAuthor = new EventEmitter<string>();

  selectedAuthors = new BehaviorSubject<string[]>([]);

  service = inject(AuthorService);

  readonly rowsPerPageOptions = [5, 10, 20, 50];
  readonly defaultRows = 10;

  first = 0;
  rows = this.defaultRows;

  regExpArray: RegExp[] = [];

  totalRecords = 0;

  currentPageData: FilteredAuthorSearchResult[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'].currentValue !== changes['query'].previousValue) {
      const firstPage: TableLazyLoadEvent = {
        first: 0,
        rows: this.rows,
      };
      if (this.query) {
        this.regExpArray = this.queryToRegExp(this.query);
      }
      if (!changes['query'].firstChange) {
        // the first load is managed by the table's onLazyLoad() callback
        this.loadData(firstPage);
      }
    }
  }

  queryToRegExp(query: string): RegExp[] {
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

    this.service.findAuthors(this.query, { from: this.first, pageSize: this.rows }).pipe(take(1)).subscribe((res) => {
      this.currentPageData = res.data.map(author => ({
        _id: author._id,
        mainNameVariant: author.mainNameVariant,
        firstMatchingNameVariant: this.getFirstMatchingVariant(author),
      }));
      this.totalRecords = res.pagination.totalCount;
    });
  }

  onShowAuthorInfo(_id: string) {
    this.showAuthorInfo.emit(_id);
  }

  onSelectAuthor(_id: string) {
    this.selectedAuthors.next([...this.selectedAuthors.getValue(), _id]);
    this.selectAuthor.emit(_id);
  }

  onUnselectAuthor(_id: string) {
    this.selectedAuthors.next([...this.selectedAuthors.getValue().filter(id => id !== _id)]);
    this.selectAuthor.emit(_id);
  }

  getFirstMatchingVariant(author: AuthorSearchResultDto): AuthorNameVariant | undefined {
    const mainVariantMatches = this.regExpArray.every(regExp => regExp.test(author.mainNameVariant.display));
    const firstMatchingNameVariant = author.matchingNameVariants?.length ? author.matchingNameVariants[0] : undefined;
    return (!mainVariantMatches && firstMatchingNameVariant) ? firstMatchingNameVariant : undefined;
  }
}
