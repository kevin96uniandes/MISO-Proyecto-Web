import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './incident/form/form.component';
import { LoginComponent } from './pages/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, FormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ABCall-web';
}
