import { CommonModule, Location } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentService } from '../incident.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
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
    UploadFilesComponent,
    TranslateModule
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
    private location: Location,
    private translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {

    const lang = this.storageService.getItem("language")
    this.translate.use(lang ?? 'es')

    this.person = history.state?.person;
    console.log('form ' + this.person)

    this.incidentForm = this.formBuilder.group({
      name: [this.person?.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: [this.person?.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      identityType: [this.person?.tipo_identificacion, Validators.required],
      emailClient: [this.person?.correo_electronico, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      identityNumber: [this.person?.numero_identificacion, [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      cellPhone: [this.person?.telefono, [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      incidentType: ["", Validators.required],
      incidentChannel: ["", Validators.required],
      incidentSubject: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      incidentDetail: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
    })
  }

  onFilesChanged(files: File[]) {
    this.attachedFiles = files;
  }

  goBack() {
    this.location.back()
  }

  createIncident() {
    this.isLoading = true;
    const formData = new FormData()

    if (!this.incidentForm.invalid) {
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

          this.translate.get(['SAVE_INCIDENT_SUCCESS_MESSAGE', 'CONFIRM_BUTTON_TEXT'], { codigo: response['codigo'] }).subscribe(translations => {
            const successMessage = translations['SAVE_INCIDENT_SUCCESS_MESSAGE'];
            const textButtonSucces = translations['CONFIRM_BUTTON_TEXT'];
            this.isLoading = false;

            Swal.fire({
              icon: 'success',
              title: successMessage,
              confirmButtonText: textButtonSucces,
              confirmButtonColor: '#82BDAE'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/dashboard/user-query'])
              }
            });
          });

        },
        error: (error) => {
          this.translate.get(['SAVE_INCIDENT_ERROR_MESSAGE']).subscribe(translations => {
            const errorMessage = translations['SAVE_INCIDENT_ERROR_MESSAGE'];
            this.isLoading = false;

            Swal.fire({
              icon: 'error',
              title: errorMessage,
            });
            console.log(error);
          })
        }
      });
    }
  }
}
