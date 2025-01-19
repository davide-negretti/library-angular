import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { Author } from '../../../interfaces/models/author.model';
import { AuthorNameVariantsComponent } from '../../common/authors/author-name-variants/author-name-variants.component';
import { CreateAuthorComponent } from '../../common/authors/create-author/create-author.component';

enum OnSaveAction {
  NAVIGATE,
  NEXT,
  RESTART,
}

@Component({
  selector: 'l-new-author',
  imports: [
    CreateAuthorComponent,
    StepperModule,
    ButtonModule,
    AuthorNameVariantsComponent,
    MessageModule,
    SplitButtonModule,
  ],
  templateUrl: './new-author.component.html',
  styleUrl: './new-author.component.scss',
})
export class NewAuthorComponent {
  @ViewChild('createAuthorComponent') createAuthorComponent!: CreateAuthorComponent;

  protected readonly saveButtonItems = [
    {
      label: 'continue',
      command: () => {
        this.onSaveAndNext();
      },
    },
    {
      label: 'create new author',
      command: () => {
        this.onSaveAndRestart();
      },
    },
    {
      label: 'show author',
      command: () => {
        this.onSaveAndNavigate();
      },
    },
  ];

  protected currentStep = 1;
  protected author: Author | undefined;

  private onSaveAction: OnSaveAction | undefined;
  private readonly router = inject(Router);

  protected newAuthor() {
    this.author = undefined;
    this.currentStep = 1;
  }

  protected nextStep() {
    this.currentStep++;
  }

  protected async navigate(author: Author) {
    await this.router.navigate(['authors', author._id]);
  }

  protected async onAuthorSaved(author: Author) {
    this.author = author;
    switch (this.onSaveAction) {
      case OnSaveAction.NAVIGATE:
        await this.navigate(author);
        break;
      case OnSaveAction.NEXT:
        this.nextStep();
        break;
      case OnSaveAction.RESTART:
        this.newAuthor();
        break;
    }
  }

  private onSaveAndNext() {
    this.onSaveAction = OnSaveAction.NEXT;
    this.createAuthorComponent.saveAuthor();
  }

  private onSaveAndRestart() {
    this.onSaveAction = OnSaveAction.RESTART;
    this.createAuthorComponent.saveAuthor();
  }

  private onSaveAndNavigate() {
    this.onSaveAction = OnSaveAction.NAVIGATE;
    this.createAuthorComponent.saveAuthor();
  }
}
