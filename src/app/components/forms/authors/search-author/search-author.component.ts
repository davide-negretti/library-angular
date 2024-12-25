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
import { Author } from '../../../../models/author.model';
import { AuthorService } from '../../../../services/rest/author.service';

interface LoadedData {
  id: string;
  name: string;
  alias?: string;
  listDisplay: string;
}

@Component({
  selector: 'l-search-author',
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
  templateUrl: './search-author.component.html',
  styleUrl: './search-author.component.scss',
})
export class SearchAuthorComponent {
  service = inject(AuthorService);

  searchQuery = '';
  loadedData = signal<LoadedData[]>([]);

  readonly pageSize = 20;
  startFrom = 0;
  isLastPageEmpty = false;

  selectedAuthor: LoadedData | undefined;

  selectedAuthorId = output<string>();
  addNewAuthor = output<string>();

  onLoadMore() {
    if (!this.isLastPageEmpty) {
      this.loadPage(this.searchQuery);
    }
  }

  resetSearch() {
    this.startFrom = 0;
    this.isLastPageEmpty = false;
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

  transformData(responseData: Author[], query: string) {
    return responseData.flatMap((author: Author) => {
      const regExp = new RegExp(query, 'i');
      const mainVariant = author.nameVariants
        .find(nameVariant => nameVariant._id === author.mainVariantId);
      if (mainVariant && regExp.test(mainVariant.display)) {
        const mainVariantDisplay: LoadedData = {
          id: author._id,
          name: mainVariant.display,
          listDisplay: mainVariant.sorting,
        };
        return [mainVariantDisplay];
      } else {
        return author.nameVariants.filter(nameVariant =>
          regExp.test(nameVariant.display) && nameVariant._id !== author.mainVariantId,
        ).map((nameVariant): LoadedData => {
          return {
            id: author._id,
            name: mainVariant ? mainVariant.display : nameVariant.display,
            alias: mainVariant ? nameVariant.display : undefined,
            listDisplay: mainVariant ? `${mainVariant.sorting} (${nameVariant.display})` : nameVariant.sorting,
          };
        });
      }
    });
  }

  loadPage(query: string) {
    if (!this.isLastPageEmpty) {
      this.service.find(query, this.startFrom, this.pageSize).pipe(take(1)).subscribe((res) => {
        const responseData = res.data;
        this.startFrom += this.pageSize;
        this.loadedData.update(previousData => [...previousData, ...this.transformData(responseData, query)]);
        if (responseData.length < this.pageSize) {
          this.isLastPageEmpty = true;
        }
      });
    }
  }

  onSelectCurrent() {
    if (!this.selectedAuthor) {
      console.warn('No author selected');
      return;
    }
    this.selectedAuthorId.emit(this.selectedAuthor.id);
  }

  onAddNew() {
    this.addNewAuthor.emit(this.searchQuery);
  }
}
