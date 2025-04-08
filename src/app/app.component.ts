import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'l-root',
  imports: [
    ConfirmDialogModule,
    HeaderComponent,
    RouterOutlet,
    Toast,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

}
