import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { AuthorSearchResultDto } from '../../../../interfaces/dtos/author-search-result.dto';
import { AuthorService } from '../../../../services/rest/author.service';

@Component({
  selector: 'l-author-list',
  imports: [PaginatorModule, TableModule, ButtonModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnInit {
  @Input() query = '';
  @Output() authorSelected = new EventEmitter<string>();

  service = inject(AuthorService);

  readonly rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 10;

  totalRecords = 0;

  currentPageData: AuthorSearchResultDto[] = [];

  ngOnInit() {
    const firstPage: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
    };
    this.loadData(firstPage);
  }

  loadData(loadEvent: TableLazyLoadEvent) {
    this.first = loadEvent.first ?? 0;
    this.rows = loadEvent.rows ?? 5;

    this.service.findAuthors(this.query, { from: this.first, pageSize: this.rows }).pipe(take(1)).subscribe((res) => {
      this.currentPageData = res.data;
      this.totalRecords = res.pagination.totalCount;
    });
  }

  onAuthorSelected(_id: string) {
    this.authorSelected.emit(_id);
  }
}
