import { Component } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  selector: 'l-header',
  imports: [
    MainMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

}
