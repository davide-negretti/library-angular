import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { AuthorSearchResultDto } from '../../../interfaces/dtos/author-search-result.dto';
import { AuthorService } from '../../../services/rest/author.service';

@Component({
  selector: 'l-author-list',
  imports: [PaginatorModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnInit {
  service = inject(AuthorService);

  readonly rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;

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

    this.service.findAuthors('', { from: this.first, pageSize: this.rows }).pipe(take(1)).subscribe((res) => {
      this.currentPageData = res.data;
      this.totalRecords = res.pagination.totalCount;
    });
  }
}
