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
  styleUrl: './main-menu.component.css',
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
      items: [
        {
          label: 'All authors',
          icon: 'pi pi-list',
          route: 'authors',
        },
        {
          label: 'New author',
          icon: 'pi pi-plus',
          route: 'authors/new',
        },
      ],
    },
  ];

  toggleDarkMode() {
    document.querySelector('html')?.classList.toggle('dark');
    document.querySelector('main')?.classList.toggle('dark:prose-invert');
  }
}
