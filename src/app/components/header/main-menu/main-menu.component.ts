import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'l-main-menu',
  imports: [
    MenubarModule,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '',
    },
    {
      label: 'Authors',
      icon: 'pi pi-users',
      route: 'authors',
    },
  ];

  toggleDarkMode() {
    document.querySelector('html')?.classList.toggle('dark-mode');
    document.querySelector('main')?.classList.toggle('dark:prose-invert');
  }
}
