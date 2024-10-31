import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StorageService } from '../../../common/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../incident.service';
import { Agente } from '../../auth/user';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    UploadFilesComponent,
    TranslateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './incident-dialog.component.html',
  styleUrl: './incident-dialog.component.scss'
})
export class IncidentDialogComponent {
  incidentManagementForm!: FormGroup
  attachedFiles: File[] = [];
  agents: Agente[] = [];
  filteredAgents!: Observable<Agente[]>;
  assignedToId!: number
  isClosed: boolean = false
  hasMoreThanOneAgent: boolean = true
  incidentStatus!: string
  incidentInitialAssignedTo!: number
    
  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<IncidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private storageService: StorageService,
    private translate: TranslateService,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ){
      const lang = this.storageService.getItem("language")
      this.translate.use(lang || 'es')
    }

  ngOnInit(){

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    let companyId = decoded["id_company"];

    this.incidentStatus = this.data.status
    this.incidentInitialAssignedTo = this.data.assignedTo

    if(this.data.status == "4" || this.data.status == "5"){
      this.isClosed = true
    }

    this.incidentManagementForm = this.formBuilder.group({ 
      status: [`${this.data.status}`, [Validators.required]],
      assignedTo: [`${this.data.assignedTo}`, [Validators.required, this.mustSelectValidAgent(), this.mustChangeAssignedToValidator()]],
      observations: ["", [Validators.minLength(2), Validators.maxLength(300)]]
    });

    this.inicializeFilterAgent(companyId)  
    this.suscribeStatusChange() 
  }

  suscribeStatusChange(): void {
    this.incidentManagementForm.get('status')?.valueChanges.subscribe(value => {
      console.log(value)
      this.incidentManagementForm.get('assignedTo')?.markAsTouched()
      this.incidentManagementForm.get('assignedTo')?.updateValueAndValidity()
      this.cdr.detectChanges();
          
    })
  }

  inicializeFilterAgent(companyId: number): void{
    this.incidentService.getAgentsAvaiables(companyId).subscribe({
      next: (agents: Agente[]) => {
        console.log(agents)
        this.agents = agents

        if(this.agents.length <= 1){
          this.hasMoreThanOneAgent = false
        }

        const assignedAgent = this.agents.find(agent => agent.id == this.data.assignedTo);
        if (assignedAgent) {
          this.incidentManagementForm.patchValue({ assignedTo: assignedAgent });
        }

        this.filteredAgents = this.incidentManagementForm.get('assignedTo')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre_completo;
            return name ? this._filter(name as string) : this.agents.slice();
          }),
        );
      }  
    });
  }

  mustChangeAssignedToValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if(this.incidentManagementForm){
        if(this.incidentManagementForm.get('status')?.value === "3"){
          const agent = control.value 
          return agent?.id === this.incidentInitialAssignedTo
          ? { mustChange: true }
          : null;
        }else{
          return null;
        }
      }
      return null;
    };
  }

  mustSelectValidAgent(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !(typeof control.value === 'object' && control.value !== null && 'id' in control.value)
        ? { invalidAgent: true }
        : null;
    };
  }

  displayAgentName(agent: Agente): string {
    return agent && agent.nombre_completo ? agent.nombre_completo : '';
  }

  private _filter(name: string): Agente[] {
    const filterValue = name.toLowerCase();
    return this.agents.filter(option => option.nombre_completo.toLowerCase().includes(filterValue));
  }

  onFilesChanged(files: File[]) {
    this.attachedFiles = files;
   }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    console.log(this.incidentManagementForm.valid)
    if(this.incidentManagementForm.valid){

      const formData = new FormData()

      Object.keys(this.incidentManagementForm.controls).forEach(key => {
        let controlValue;
        if(key == 'assignedTo'){
          controlValue = (this.incidentManagementForm.get(key)?.value as Agente).id;
        }else{
          controlValue = this.incidentManagementForm.get(key)?.value;
        }
        formData.append(key, controlValue);
      });

      this.attachedFiles.forEach((file) => {
        formData.append('files', file);
      });

      let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
      formData.append('userCreatorId', decoded["id"]);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.dialogRef.close(formData);
    }else{
      Object.values(this.incidentManagementForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }


}
