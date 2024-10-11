import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatFormFieldModule,} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import {MatButtonModule} from '@angular/material/button';
import {NgOptimizedImage} from "@angular/common";
import {MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { RegisterService } from '../register.service';
import { RegisterClient } from './register-client';

interface Language {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register-client',
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
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterClientComponent {
  registerForm: FormGroup;
  selectedValue: string = '';

  constructor(
    private RegisterClientService: RegisterService,
    private formBuilder: FormBuilder
  ) {
    this.selectedValue = "es";

    this.registerForm = this.formBuilder.group({
      nombre_completo: ['', [Validators.required]],
      tipo_documento: ['', [Validators.required]],
      numero_documento: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      confirmar_contrasena: ['', [Validators.required]],
    })
  }

  languages: Language[] = [
    {value: 'en', viewValue: 'English'},
    {value: 'es', viewValue: 'Español'},
  ]

  onSubmit() {
    if(this.registerForm?.valid){
      const registerClient = new RegisterClient(
        this.registerForm.value.nombre_completo,
        this.registerForm.value.email,
        this.registerForm.value.tipo_documento,
        this.registerForm.value.numero_documento,
        this.registerForm.value.sector,
        this.registerForm.value.telefono,
        this.registerForm.value.pais,
        this.registerForm.value.usuario,
        this.registerForm.value.contrasena,
        this.registerForm.value.confirmar_contrasena
      );

      this.RegisterClientService.registerClient(registerClient).subscribe(response => {
        console.log('Registro exitoso', response);
      }, error => {
        console.error('Error en el registro', error);
      });
    }
  }
}
