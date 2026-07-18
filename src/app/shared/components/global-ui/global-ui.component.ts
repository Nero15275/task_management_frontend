import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-global-ui',
  standalone: true,
  imports: [
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './global-ui.component.html',
  styleUrl: './global-ui.component.scss'
})
export class GlobalUiComponent {

}
