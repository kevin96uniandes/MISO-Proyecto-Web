import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../common/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    UploadFilesComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './incident-dialog.component.html',
  styleUrl: './incident-dialog.component.scss'
})
export class IncidentDialogComponent {
  incidentManagementForm!: FormGroup
  attachedFiles: File[] = [];

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<IncidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private storageService: StorageService,
    private translate: TranslateService,
  ){
      const lang = this.storageService.getItem("language")
      this.translate.use(lang || 'es')
    }

  ngOnInit(){

    this.incidentManagementForm = this.formBuilder.group({ 
      status: [`${this.data.status}`, Validators.required],
      assignetTo: [""],
      observations: ["", [Validators.minLength(2), Validators.maxLength(300)]]
    });
  }

  onFilesChanged(files: File[]) {
    this.attachedFiles = files;
   }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if(this.incidentManagementForm.valid){

      const formData = new FormData()

      Object.keys(this.incidentManagementForm.controls).forEach(key => {
        const controlValue = this.incidentManagementForm.get(key)?.value;
        formData.append(key, controlValue);
      });

      this.attachedFiles.forEach((file) => {
        formData.append('files', file);
      });

      let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
      formData.append('userCreatorId', decoded["id"]);

      console.log(formData)

      this.dialogRef.close(formData);
    }
  }


}
