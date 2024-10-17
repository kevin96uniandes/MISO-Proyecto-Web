import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import {MatButtonModule} from '@angular/material/button';
import {NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { StorageService } from '../../../common/storage.service';
import Swal from 'sweetalert2';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {EMPTY, merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Login} from "./login";
import { JwtHelperService } from '@auth0/angular-jwt';

interface Language {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TextFieldModule,
    MatButtonModule,
    NgOptimizedImage,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedValue: string = '';
  errorUsernameMessage = signal('');
  errorPasswordMessage = signal('');

  error: string = "";
  helper = new JwtHelperService();

  constructor(
    private loginService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.selectedValue = "es";

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    merge(this.loginForm.get("username")?.statusChanges ?? EMPTY, this.loginForm.get("username")?.valueChanges ?? EMPTY)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorUsernameMessage());

    merge(this.loginForm.get("password")?.statusChanges ?? EMPTY, this.loginForm.get("password")?.valueChanges ?? EMPTY)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPasswordMessage());
  }

  languages: Language[] = [
    {value: 'en', viewValue: 'English'},
    {value: 'es', viewValue: 'Español'},
  ];

  authenticate(login: Login) {
    this.error = ""

    this.loginService.login(login)
      .subscribe({
          next: (res) => {
            this.storageService.setItem('decodedToken', JSON.stringify(this.helper.decodeToken(res.token)));
            this.storageService.setItem('token', res.token);
            this.router.navigate([`dashboard`]);
          },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Usuario o contraseña incorrectos',
          });
        }
      })
  }

  updateErrorUsernameMessage() {
    if (this.loginForm.get("username")?.hasError('required')) {
      this.errorUsernameMessage.set('Campo requerido');
    } else {
      this.errorUsernameMessage.set('');
    }
  }

  updateErrorPasswordMessage() {
    if (this.loginForm.get("password")?.hasError('required')) {
      this.errorPasswordMessage.set('Campo requerido');
    } else {
      this.errorPasswordMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
