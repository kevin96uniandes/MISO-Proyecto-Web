import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import Swal from 'sweetalert2';
import { Person } from '../../auth/person';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    UploadFilesComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  incidentForm!: FormGroup
  attachedFiles: File[] = [];
  person!: Person;
  isLoading: boolean = false; 

  constructor(private formBuilder: FormBuilder,
    private incidentService: IncidentService,
    private storageService: StorageService,
    private router: Router,
    private location: Location
  ){  }

 ngOnInit(): void {

    this.person = history.state?.person;
    console.log('form '+this.person)

    this.incidentForm = this.formBuilder.group({
      name: [this.person?.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: [this.person?.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      identityType: [this.person?.tipo_identificacion, Validators.required],
      emailClient: [this.person?.correo_electronico, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      identityNumber: [this.person?.numero_identificacion, [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]],
      cellPhone: [this.person?.telefono, [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]],
      incidentType: ["", Validators.required],
      incidentChannel: ["", Validators.required],
      incidentSubject: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      incidentDetail: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
    }) 
 }

 onFilesChanged(files: File[]) {
  this.attachedFiles = files;
}

 goBack(){
  this.location.back()
 }

 createIncident(){
  this.isLoading = true;
  const formData = new FormData()

  if(!this.incidentForm.invalid){
    Object.keys(this.incidentForm.controls).forEach(key => {
      const controlValue = this.incidentForm.get(key)?.value;
      formData.append(key, controlValue);
    });
  
    this.attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["id"]);

    formData.append('user_id', decoded["id"]);
    formData.append('person_id', this.person?.id ? this.person.id.toString() : '');

    this.incidentService.createIncident(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log(response);
        Swal.fire({
          icon: 'success',
          title: `Se ha creado la incidencia ${response['codigo']} con exito`,
          confirmButtonText: 'Aceptar', 
          confirmButtonColor: '#82BDAE'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/dashboard/user-query'])
          }
        });
      },
      error: (error) => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Se ha presentado un error a la hora de crear la incidencia',
        });
        console.log(error);
      }
    });  
  }
  
 }

}
