import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { StepperModule } from 'primeng/stepper';
import { Author } from '../../../interfaces/models/author.model';
import { AuthorNameVariantsComponent } from '../../common/authors/author-name-variants/author-name-variants.component';
import { CreateAuthorComponent } from '../../common/authors/create-author/create-author.component';

@Component({
  selector: 'l-new-author',
  imports: [
    CreateAuthorComponent,
    StepperModule,
    ButtonModule,
    AuthorNameVariantsComponent,
    MessageModule,
  ],
  templateUrl: './new-author.component.html',
  styleUrl: './new-author.component.scss',
})
export class NewAuthorComponent {
  currentStep = 1;
  author: Author | undefined;

  onAuthorSaved(author: Author) {
    this.author = author;
    this.currentStep++;
  }

  nextStep() {
    this.currentStep++;
  }

  newAuthor() {
    this.author = undefined;
    this.currentStep = 1;
  }
}
