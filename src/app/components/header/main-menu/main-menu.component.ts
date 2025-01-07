import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'l-main-menu',
  imports: [
    MenubarModule,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/',
    },
  ];
}
