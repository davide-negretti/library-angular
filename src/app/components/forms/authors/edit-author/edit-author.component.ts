import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { AuthorNameVariant } from '../../../../models/author.model';
import { AuthorService } from '../../../../services/rest/author.service';

@Component({
  selector: 'l-edit-author',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonGroup,
    ButtonModule,
    ConfirmDialogModule,
    Dialog,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    TableModule,
    Tag,
    Tooltip,
    JsonPipe,
  ],
  templateUrl: './edit-author.component.html',
  styleUrl: './edit-author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAuthorComponent implements OnInit {
  @Input({ required: true }) authorId!: string;

  @ViewChild('nameVariantForm') nameVariantForm: NgForm | undefined;

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  nameVariants = new BehaviorSubject<AuthorNameVariant[]>([]);
  mainVariantId = new BehaviorSubject<string | undefined>(undefined);

  nameVariants$ = this.nameVariants.asObservable();

  showNameVariantDialog = false;

  nameVariant: Partial<AuthorNameVariant> = {};
  isSavingNameVariant = false;

  readonly types = [
    'original', 'short', 'pseudonym',
  ];

  private readonly service = inject(AuthorService);
  private readonly cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.service.getById(this.authorId).pipe(
      take(1),
    ).subscribe({
      next: (author) => {
        const variantRecord: Record<string, boolean> = {};
        for (const variant of author.nameVariants) {
          variantRecord[variant._id] = false;
        }
        this.nameVariants.next([...author.nameVariants]);
        this.mainVariantId.next(author.mainVariantId);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Author data cannot be loaded.`,
        });
      },
    });
  }

  isMainVariant(variant: AuthorNameVariant) {
    return this.mainVariantId.asObservable().pipe(
      map(mainVariantId => mainVariantId === variant._id),
    );
  }

  onSetMainVariant(variant: AuthorNameVariant) {
    this.service.setMainVariant(this.authorId, variant._id).pipe(
      take(1),
      tap((res) => {
        if (res.mainVariantId !== variant._id) {
          throw new Error('Unable to set main variant');
        }
      }),
    ).subscribe({
      next: (res) => {
        this.mainVariantId.next(res.mainVariantId);
      },
      error: (error) => {
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
    this.nameVariantForm!.form.reset();
    this.nameVariant = nameVariant ? { ...nameVariant } : {};
    this.showNameVariantDialog = true;
  }

  closeEditDialog() {
    this.nameVariant = {};
    this.showNameVariantDialog = false;
  }

  onSaveNameVariant() { // TODO
    this.isSavingNameVariant = true;
    this.service.saveNameVariant(this.authorId, this.nameVariant as AuthorNameVariant).pipe(take(1)).subscribe({
      next: (updatedAuthor) => {
        this.nameVariants.next([...updatedAuthor.nameVariants]);
        this.isSavingNameVariant = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: `Name variant "${this.nameVariant.display}" has been updated.`,
        });
        this.closeEditDialog();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Name variant "${this.nameVariant.display}" cannot be updated.`,
        });
      },
    });
  }

  onAddNameVariant() { // TODO
    this.isSavingNameVariant = true;
    this.service.addNameVariant(this.authorId, this.nameVariant as AuthorNameVariant).pipe(take(1)).subscribe({
      next: (updatedAuthor) => {
        this.nameVariants.next([...updatedAuthor.nameVariants]);
        this.isSavingNameVariant = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: `Name variant "${this.nameVariant.display}" has been added.`,
        });
        this.closeEditDialog();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred. Name variant "${this.nameVariant.display}" cannot be added.`,
        });
      },
    });
  }

  onDeleteVariant(nameVariant: AuthorNameVariant) {
    this.confirmationService.confirm({
      accept: () => {
        this.service.deleteNameVariant(this.authorId, nameVariant._id).pipe(
          take(1),
        ).subscribe({
          next: (updatedAuthor) => {
            this.nameVariants.next([...updatedAuthor.nameVariants]);
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
        });
      },
      message: `Do you want to delete the variant <i>${nameVariant.display}</i>?`,
      icon: 'pi pi-exclamation-circle',
      header: 'Delete name variant',
      defaultFocus: 'reject',
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        icon: 'pi pi-trash',
      },
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        icon: 'pi pi-times',
      },
    });
  }
}
