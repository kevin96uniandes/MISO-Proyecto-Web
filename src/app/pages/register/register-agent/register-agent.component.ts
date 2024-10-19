import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegisterService } from '../register.service';
import { RegisterAgent } from './register-agent';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

interface Language {
  value: string;
  viewValue: string;
}

interface DocumentType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-register-agent',
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
    TranslateModule
  ],
  templateUrl: './register-agent.component.html',
  styleUrls: ['./register-agent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAgentComponent {
  registerForm: FormGroup;
  selectedValue: string = '';
  errorRequiredMessage: Map<string, string> = new Map<string, string>();

  documentTypes: DocumentType[] = [
    { value: 1, viewValue: 'CC' },
    { value: 2, viewValue: 'TI' },
    { value: 3, viewValue: 'NIT' }
  ];

  ngOnInit() {
    const lang = this.storageService.getItem("language")
    this.selectedValue = lang || 'es';
    this.translate.use(this.selectedValue)
  }

  constructor(
    private RegisterAgentService: RegisterService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService
  ) {

    this.registerForm = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      tipo_identificacion: ['', [Validators.required]],
      numero_identificacion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$')
      ]],
      confirmar_contrasena: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  languages: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'es', viewValue: 'Español' },
  ];

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmar_contrasena');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  updateErrorRequiredMessage(fieldName: string) {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      this.translate.get(['REQUIRED_FILE']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_FILE']);
      });
    } else if (control?.hasError('email')) {
      this.translate.get(['REQUIRED_EMAIL']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_EMAIL']);
      });
    } else if (this.registerForm.get("telefono")?.hasError('pattern')) {
      this.translate.get(['REQUIRED_PHONE_FORMAT']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_PHONE_FORMAT']);
      });
    } else if (this.registerForm.get("contrasena")?.hasError('pattern')) {
      this.translate.get(['REQUIRED_PASSWORD_FORMAT']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_PASSWORD_FORMAT']);
      });
    } else if (control?.hasError('minLength')) {
      this.translate.get(['REQUIRED_PASSWORD_SIZE']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_PASSWORD_SIZE']);
      });
    }
    else if (control?.hasError('mismatch')) {
      this.translate.get(['REQUIRED_PASSWORD_MISMATCH']).subscribe(translations => {
        this.errorRequiredMessage.set(fieldName, translations['REQUIRED_PASSWORD_MISMATCH']);
      });
    } else {
      this.errorRequiredMessage.set(fieldName, '');
    }
  }

  getErrorRequiredMessage(fieldName: string): string {
    return this.errorRequiredMessage.get(fieldName) || '';
  }

  onSubmit() {

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["id_company"]);

    let empresa_id = decoded["id_company"];

    if (this.registerForm?.valid) {
      const registerAgent = new RegisterAgent(
        this.registerForm.value.nombres,
        this.registerForm.value.apellidos,
        this.registerForm.value.correo_electronico,
        this.registerForm.value.tipo_identificacion,
        this.registerForm.value.numero_identificacion,
        this.registerForm.value.telefono,
        this.registerForm.value.usuario,
        this.registerForm.value.contrasena,
        this.registerForm.value.confirmar_contrasena,
        empresa_id
      );

      this.RegisterAgentService.registerAgent(registerAgent).subscribe(response => {

        this.translate.get(['REGISTER_SUCCESFULLY']).subscribe(translations => {
          console.log(translations['REGISTER_SUCCESFULLY'], response);
          this.snackBar.open(translations['REGISTER_SUCCESFULLY'], '', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard/list/agents']);
        });
      }, error => {
        this.translate.get(['REGISTER_ERROR']).subscribe(translations => {
          Swal.fire({
            icon: 'error',
            title: translations['REGISTER_ERROR'],
          });


          console.error(translations['REGISTER_ERROR'], error);
          this.snackBar.open(translations['REGISTER_ERROR'], '', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        });
      });
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  changeLanguage(lang: string) {
    console.log(lang)
    this.selectedValue = lang;
    this.translate.use(lang);
    this.storageService.setItem("language", lang)
  }

}
