import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'l-authors-toolbar',
  imports: [
    Button,
    FormsModule,
    IconField,
    InputIcon,
    InputText,
    ReactiveFormsModule,
    Toolbar,
  ],
  templateUrl: './authors-toolbar.component.html',
  styleUrl: './authors-toolbar.component.scss',
})
export class AuthorsToolbarComponent {
  @Output() searchQuery = new EventEmitter<string>();

  protected searchField = '';
  private router = inject(Router);

  protected onSubmit() {
    this.searchQuery.emit(this.searchField);
  }

  protected async onAddAuthor() {
    await this.router.navigate(['authors', 'new']);
  }
}
