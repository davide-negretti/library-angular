import { Component, ViewChild } from '@angular/core';
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
  restartOnSaved = false;

  @ViewChild('createAuthorComponent') createAuthorComponent!: CreateAuthorComponent;

  onAuthorSaved(author: Author) {
    this.author = author;
    if (this.restartOnSaved) {
      this.newAuthor();
    } else {
      this.nextStep();
    }
  }

  nextStep() {
    this.currentStep++;
  }

  newAuthor() {
    this.author = undefined;
    this.currentStep = 1;
  }

  saveAndNext() {
    this.restartOnSaved = false;
    this.createAuthorComponent.saveAuthor();
  }

  saveAndRestart() {
    this.restartOnSaved = true;
    this.createAuthorComponent.saveAuthor();
  }
}
