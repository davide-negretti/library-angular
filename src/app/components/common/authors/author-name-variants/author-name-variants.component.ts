import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, model, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { Author, AuthorNameVariant } from '../../../../interfaces/models/author.model';
import { AuthorService } from '../../../../services/rest/author.service';

@Component({
  selector: 'l-author-name-variants',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonGroup,
    ButtonModule,
    ConfirmDialogModule,
    Dialog,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    PopoverModule,
    SelectModule,
    TableModule,
    Tag,
    Tooltip,
  ],
  templateUrl: './author-name-variants.component.html',
  styleUrl: './author-name-variants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorNameVariantsComponent {
  author = model.required<Author>();

  compactView = input<boolean>(false);

  @ViewChild('nameVariantForm') protected nameVariantForm: NgForm | undefined;

  protected nameVariant: Partial<AuthorNameVariant> = {};
  protected showNameVariantDialog = false;
  protected isSavingNameVariant = false;

  protected readonly typeOptions = ['original', 'short', 'pseudonym'];
  protected readonly localizationOptions = ['original', 'transliterated', 'translated'];

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly service = inject(AuthorService);

  private nameVariants = new BehaviorSubject<AuthorNameVariant[]>([]);
  protected nameVariants$ = this.nameVariants.asObservable();
  private mainVariantId = new BehaviorSubject<string | undefined>(undefined);

  private readonly updateVariantsEffect = effect(() => {
    const variantRecord: Record<string, boolean> = {};
    for (const variant of this.author().nameVariants) {
      variantRecord[variant._id] = false;
    }
    this.nameVariants.next([...this.author().nameVariants]);
    this.mainVariantId.next(this.author().mainVariantId);
  });

  isMainVariant(variant: AuthorNameVariant) {
    return this.mainVariantId.asObservable().pipe(map(mainVariantId => mainVariantId === variant._id));
  }

  onSetMainVariant(variant: AuthorNameVariant) {
    this.service.setMainVariant(this.author()._id, variant._id).pipe(take(1), tap((res) => {
      if (res.mainVariantId !== variant._id) {
        throw new Error('Unable to set main variant');
      }
    })).subscribe({
      next: (res) => {
        this.mainVariantId.next(res.mainVariantId);
      }, error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Name variant "${variant.display}" cannot be set as main.`,
        });
      },
    });
  }

  openEditDialog(nameVariant?: AuthorNameVariant) {
    this.nameVariantForm?.form.reset();
    this.nameVariant = nameVariant ? { ...nameVariant } : { /* default values, if any */ };
    this.showNameVariantDialog = true;
  }

  closeEditDialog() {
    this.nameVariant = {};
    this.showNameVariantDialog = false;
  }

  onSaveNameVariant() { // TODO
    this.isSavingNameVariant = true;
    this.service.saveNameVariant(this.author()._id, this.nameVariant as AuthorNameVariant).pipe(take(1)).subscribe({
      next: (updatedAuthor) => {
        this.author.set(updatedAuthor);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: `Name variant "${this.nameVariant.display ?? ''}" has been updated.`,
        });
        this.closeEditDialog();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Name variant "${this.nameVariant.display ?? ''}" cannot be updated.`,
        });
      },
      complete: () => {
        this.isSavingNameVariant = false;
        this.nameVariant = {};
      },
    });
  }

  onAddNameVariant() { // TODO
    this.isSavingNameVariant = true;
    this.service.addNameVariant(this.author()._id, this.nameVariant as AuthorNameVariant).pipe(take(1)).subscribe({
      next: (updatedAuthor) => {
        this.author.set(updatedAuthor);
        this.isSavingNameVariant = false;
        this.messageService.add({
          detail: `Name variant "${this.nameVariant.display ?? ''}" has been added.`,
          severity: 'success',
          summary: 'Added',
        });
        this.closeEditDialog();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Name variant "${this.nameVariant.display ?? ''}" cannot be added.`,
        });
      },
      complete: () => {
        this.isSavingNameVariant = false;
        this.nameVariant = {};
      },
    });
  }

  onDeleteVariant(nameVariant: AuthorNameVariant) {
    this.confirmationService.confirm({
      accept: () => {
        this.service.deleteNameVariant(this.author()._id, nameVariant._id).pipe(take(1)).subscribe({
          next: (updatedAuthor) => {
            this.author.set(updatedAuthor);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `Name variant "${nameVariant.display}" has been deleted.`,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `An error occurred. Name variant "${nameVariant.display}" has not been deleted.`,
            });
          },
          complete: () => {
            this.isSavingNameVariant = false;
            this.nameVariant = {};
          },
        });
      },
      message: `Do you want to delete the variant <i>${nameVariant.display}</i>?`,
      icon: 'pi pi-exclamation-circle',
      header: 'Delete name variant',
      defaultFocus: 'reject',
      acceptButtonProps: {
        label: 'Delete', severity: 'danger', icon: 'pi pi-trash',
      },
      rejectButtonProps: {
        label: 'Cancel', severity: 'secondary', icon: 'pi pi-times',
      },
    });
  }

  getLangAndScript(nameVariant: AuthorNameVariant) {
    const langAndScript: string[] = [];
    if (nameVariant.script) {
      langAndScript.push(nameVariant.script);
    }
    if (nameVariant.language) {
      langAndScript.push(nameVariant.language);
    }
    return langAndScript.join(' : ');
  }
}
