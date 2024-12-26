import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { InputTextModule } from 'primeng/inputtext';
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
    InputTextModule,
    FormsModule,
    TableModule,
    Tag,
    Tooltip,
  ],
  templateUrl: './edit-author.component.html',
  styleUrl: './edit-author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAuthorComponent implements OnInit {
  @Input({ required: true }) authorId!: string;

  nameVariants = new BehaviorSubject<AuthorNameVariant[]>([]);
  mainVariantId = new BehaviorSubject<string | undefined>(undefined);

  nameVariants$ = this.nameVariants.asObservable();

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
    ).subscribe((author) => {
      const variantRecord: Record<string, boolean> = {};
      for (const variant of author.nameVariants) {
        variantRecord[variant._id] = false;
      }
      this.nameVariants.next([...author.nameVariants]);
      this.mainVariantId.next(author.mainVariantId);
    });
  }

  isMainVariant(variant: AuthorNameVariant) {
    return this.mainVariantId.asObservable().pipe(
      map(mainVariantId => mainVariantId === variant._id),
    );
  }

  onSetMainVariant(variantId: string) {
    this.service.setMainVariant(this.authorId, variantId).pipe(
      take(1),
      tap((res) => {
        if (res.mainVariantId !== variantId) {
          throw new Error('Unable to set main variant');
        }
      }),
    ).subscribe({
      next: (res) => {
        // this.cd.markForCheck();
        this.mainVariantId.next(res.mainVariantId);
      },
      error: console.error,
    });
  }
}
