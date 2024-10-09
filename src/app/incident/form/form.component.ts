import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { UploadFilesComponent } from '../upload-files/upload-files.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
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

  constructor(private formBuilder: FormBuilder,
    private incidentService: IncidentService
  ){  }

 ngOnInit(): void {
    this.incidentForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      identityType: ["", Validators.required],
      emailClient: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      identityNumber: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]],
      cellPhone: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$') ]],
      incidentType: ["", Validators.required],
      incidentChannel: ["", Validators.required],
      incidentSubject: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      incidentDetail: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
    }) 
 }

 onFilesChanged(files: File[]) {
  this.attachedFiles = files;
}

 createIncident(){
  const formData = new FormData()

  if(!this.incidentForm.invalid){
    Object.keys(this.incidentForm.controls).forEach(key => {
      const controlValue = this.incidentForm.get(key)?.value;
      formData.append(key, controlValue);
    });
  
    this.attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.incidentService.createIncident(formData).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });  
  }
  
 }

}
