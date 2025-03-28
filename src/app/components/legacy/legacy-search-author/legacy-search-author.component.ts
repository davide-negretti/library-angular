import { JsonPipe } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Tooltip } from 'primeng/tooltip';
import { take } from 'rxjs';
import { AuthorNameVariantSearchResultDto } from '../../../interfaces/dtos/author-name-variant-search-result.dto';
import { AuthorService } from '../../../services/rest/author.service';

interface LoadedData {
  id: string;
  name: string;
}

@Component({
  selector: 'l-legacy-search-author',
  standalone: true,
  imports: [
    FloatLabel,
    FormsModule,
    InputText,
    ListboxModule,
    ButtonModule,
    ButtonGroup,
    JsonPipe,
    Tooltip,
  ],
  templateUrl: './legacy-search-author.component.html',
  styleUrl: './legacy-search-author.component.css',
})
export class LegacySearchAuthorComponent {
  service = inject(AuthorService);

  searchQuery = '';
  loadedData = signal<LoadedData[]>([]);

  readonly pageSize = 5;
  page = 1;
  isLastPage = false; // TODO fix

  selectedAuthor: AuthorNameVariantSearchResultDto | undefined;

  selectedAuthorId = output<string>();
  addNewAuthor = output<string>();

  onLoadMore() {
    if (!this.isLastPage) {
      this.loadPage(this.searchQuery);
    }
  }

  resetSearch() {
    this.page = 1;
    this.isLastPage = false;
    this.selectedAuthor = undefined;
    this.loadedData.update(() => []);
  }

  onSearchQueryChange() {
    this.resetSearch();
    if (this.searchQuery.length > 0) {
      this.loadPage(this.searchQuery);
    } else {
      // TODO
    }
  }

  transformData(responseData: AuthorNameVariantSearchResultDto[]) {
    return responseData.map((nameVariant: AuthorNameVariantSearchResultDto) => ({
      id: nameVariant.authorId,
      name: nameVariant.sorting,
    } as LoadedData));
  }

  loadPage(query: string) {
    this.service.findAuthorNameVariants(query, { page: this.page, pageSize: this.pageSize }).pipe(take(1)).subscribe((res) => {
      const responseData = res.data;
      const paginationData = res.pagination;
      if (this.page === paginationData.totalPages) {
        this.isLastPage = true;
      }
      this.page++;
      this.loadedData.update(previousData => [...previousData, ...this.transformData(responseData)]);
    });
  }

  onSelectCurrent() {
    if (!this.selectedAuthor) {
      console.warn('No author selected');
      return;
    }
    this.selectedAuthorId.emit(this.selectedAuthor._id);
  }

  onAddNew() {
    this.addNewAuthor.emit(this.searchQuery);
  }
}
