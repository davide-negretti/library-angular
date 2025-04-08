import { Component, computed, inject, input, linkedSignal, model } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Author, AuthorNameVariant } from '../../../interfaces/models/author.model';
import { AuthorService } from '../../../services/rest/author.service';
import { AuthorNameVariantsComponent } from '../../common/authors/author-name-variants/author-name-variants.component';

@Component({
  selector: 'l-author-details',
  imports: [
    AuthorNameVariantsComponent,
    PanelModule,
  ],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.css',
})
export class AuthorDetailsComponent {
  service = inject(AuthorService);

  readonly author = input.required<Author>();
  authorModel = linkedSignal(() => this.author());

  readonly mainVariant = computed<AuthorNameVariant | undefined>(() =>
    this.author().nameVariants.find((nameVariant: AuthorNameVariant) => nameVariant._id === this.author().mainVariantId),
  );
}
