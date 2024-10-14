import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import {MatButtonModule} from '@angular/material/button';
import {NgOptimizedImage} from "@angular/common";
import {MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { RegisterService } from '../register.service';
import { RegisterAgent } from './register-agent';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

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
    {value: 1, viewValue: 'CC'},
    {value: 2, viewValue: 'TI'},
    {value: 3, viewValue: 'NIT'}
  ];

  constructor(
    private RegisterAgentService: RegisterService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ){
    this.selectedValue = "es";

    this.registerForm = this.formBuilder.group({
      nombre_completo: ['', [Validators.required]],
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
    }, {validator: this.passwordMatchValidator});
  }

  languages: Language[] = [
    {value: 'en', viewValue: 'English'},
    {value: 'es', viewValue: 'Español'},
  ];

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmar_contrasena');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({mismatch: true});
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  updateErrorRequiredMessage(fieldName: string) {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      this.errorRequiredMessage.set(fieldName, 'Campo requerido');
    } else if (control?.hasError('email')){
      this.errorRequiredMessage.set(fieldName, 'Correo electrónico no tiene el formato correcto');
    }
    else if (this.registerForm.get("telefono")?.hasError('pattern')){
      this.errorRequiredMessage.set(fieldName, 'Teléfono debe contener solo números');
    }
    else if (this.registerForm.get("contrasena")?.hasError('pattern')){
      this.errorRequiredMessage.set(fieldName, 'Contraseña debe tener al menos una letra mayúscula, una minúscula y un número');
    }
    else if (control?.hasError('minLength')){
      this.errorRequiredMessage.set(fieldName, 'Contraseña debe tener al menos 8 caracteres');
    }
    else if (control?.hasError('mismatch')){
      this.errorRequiredMessage.set(fieldName, 'Las contraseñas no coinciden');
    }
    else {
      this.errorRequiredMessage.set(fieldName, '');
    }
  }

  getErrorRequiredMessage(fieldName: string): string {
    return this.errorRequiredMessage.get(fieldName) || '';
  }

  onSubmit() {
    if(this.registerForm?.valid){
      const registerAgent = new RegisterAgent(
        this.registerForm.value.nombre_completo,
        this.registerForm.value.correo_electronico,
        this.registerForm.value.tipo_identificacion,
        this.registerForm.value.numero_identificacion,
        this.registerForm.value.telefono,
        this.registerForm.value.usuario,
        this.registerForm.value.contrasena,
        this.registerForm.value.confirmar_contrasena
      );

      this.RegisterAgentService.registerAgent(registerAgent).subscribe(response => {
        console.log('Registro exitoso', response);
        this.snackBar.open('REGISTRO EXITOSO', '', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Usuario o contraseña incorrectos',
        });
        console.error('Error en el registro', error);
        this.snackBar.open('Error en el registro', '', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
