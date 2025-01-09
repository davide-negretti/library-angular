import { Component, inject, Input, OnInit } from '@angular/core';
import { Author, AuthorNameVariant } from '../../../interfaces/models/author.model';
import { AuthorService } from '../../../services/rest/author.service';
import { AuthorNameVariantsComponent } from '../../common/authors/author-name-variants/author-name-variants.component';

@Component({
  selector: 'l-author-details',
  imports: [
    AuthorNameVariantsComponent,
  ],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.scss',
})
export class AuthorDetailsComponent implements OnInit {
  service = inject(AuthorService);

  @Input({ required: true }) author!: Author;

  mainVariant: AuthorNameVariant | undefined;

  ngOnInit() {
    this.mainVariant = this.author.nameVariants.find((nameVariant: AuthorNameVariant) => nameVariant._id === this.author.mainVariantId);
  }
}
