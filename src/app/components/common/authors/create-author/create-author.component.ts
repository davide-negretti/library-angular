import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
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
import { NotificationService } from '../../../../services/ui/notification.service';

@Component({
  selector: 'l-create-author',
  imports: [
    Button,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ButtonGroup,
  ],
  templateUrl: './create-author.component.html',
  styleUrl: './create-author.component.css',
})
export class CreateAuthorComponent {
  @Output() authorSaved = new EventEmitter<Author>();

  @ViewChild('authorForm', { static: true }) authorForm!: NgForm;

  protected isSavingAuthor = false;

  protected nameVariantDisplay = '';
  protected nameVariantSorting = '';
  protected nameVariantType = '';
  protected nameVariantLocalization = '';
  protected authorType = '';
  protected script = '';
  protected language = '';

  protected computedNameVariantDisplay = this.nameVariantDisplay;

  protected readonly nameVariantTypeOptions = Object.values(AuthorNameVariantType);
  protected readonly nameVariantLocalizationOptions = Object.values(AuthorNameVariantLocalization);
  protected readonly authorTypeOptions = Object.values(AuthorType);

  private readonly service = inject(AuthorService);
  private readonly notificationService = inject(NotificationService);

  public get isSaveButtonDisabled() {
    return this.isSavingAuthor || this.authorForm.invalid;
  }

  public saveAuthor() {
    const author: CreateAuthorDto = {
      display: this.nameVariantDisplay,
      sorting: this.nameVariantSorting,
      mainNameVariantType: this.nameVariantType,
      authorType: this.authorType,
      localization: this.nameVariantLocalization,
      script: this.script.length ? this.script : undefined,
      language: this.language.length ? this.language : undefined,
    };
    this.service.createAuthor(author).pipe(take(1)).subscribe({
      next: (author: Author) => {
        this.authorSaved.emit(author);
        this.authorForm.reset();
      },
      error: (error) => {
        console.error(error);
        this.notificationService.error('Error', `An error occurred. Author cannot be saved.`);
      },
    });
  }

  protected fillDisplay() {
    if (this.nameVariantDisplay === this.computedNameVariantDisplay && this.nameVariantSorting.includes(',')) {
      const indexOfComma = this.nameVariantSorting.indexOf(',');
      this.nameVariantDisplay = this.nameVariantSorting.slice(indexOfComma + 1).trim() + ' ' + this.nameVariantSorting.slice(0, indexOfComma).trim();
      this.computedNameVariantDisplay = this.nameVariantDisplay;
    }
  }
}
