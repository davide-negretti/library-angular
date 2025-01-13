import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs';
import { CreateAuthorDto } from '../../../../interfaces/dtos/create-author.dto';
import {
  Author,
  AuthorNameVariantLocalization,
  AuthorNameVariantType,
  AuthorType,
} from '../../../../interfaces/models/author.model';
import { AuthorService } from '../../../../services/rest/author.service';

@Component({
  selector: 'l-create-author',
  imports: [
    Button,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
  ],
  templateUrl: './create-author.component.html',
  styleUrl: './create-author.component.scss',
})
export class CreateAuthorComponent {
  @Input() saveButtonLabel = 'Save';
  @Input() saveButtonIcon = 'pi-save';
  @Input() saveButtonIconPos: 'left' | 'right' = 'left';
  @Output() authorSaved = new EventEmitter<Author>();

  isSavingAuthor = false;

  nameVariantDisplay = '';
  nameVariantSorting = '';
  nameVariantType = '';
  nameVariantLocalization = '';
  authorType = '';
  script = '';
  language = '';

  computedNameVariantDisplay = this.nameVariantDisplay;

  nameVariantTypeOptions = Object.values(AuthorNameVariantType);
  nameVariantLocalizationOptions = Object.values(AuthorNameVariantLocalization);
  authorTypeOptions = Object.values(AuthorType);

  private readonly service = inject(AuthorService);
  private readonly messageService = inject(MessageService);

  saveAuthor() {
    const author: CreateAuthorDto = {
      display: this.nameVariantDisplay,
      sorting: this.nameVariantSorting,
      mainNameVariantType: 'original', // TODO fix
      authorType: 'person', // TODO fix
      localization: this.nameVariantLocalization,
      script: this.script.length ? this.script : undefined,
      language: this.language.length ? this.language : undefined,
    };
    this.service.createAuthor(author).pipe(take(1)).subscribe({
      next: (author: Author) => {
        this.authorSaved.emit(author);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Author cannot be saved.`,
        });
      },
    });
  }

  fillDisplay() {
    if (this.nameVariantDisplay === this.computedNameVariantDisplay && this.nameVariantSorting.includes(',')) {
      const indexOfComma = this.nameVariantSorting.indexOf(',');
      this.nameVariantDisplay = this.nameVariantSorting.slice(indexOfComma + 1).trim() + ' ' + this.nameVariantSorting.slice(0, indexOfComma).trim();
      this.computedNameVariantDisplay = this.nameVariantDisplay;
    }
  }
}
