import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalUiComponent } from './shared/components/global-ui/global-ui.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,GlobalUiComponent,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-manager-frontend';



}
