import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncidentService } from '../incident.service';
import { StorageService } from '../../../common/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Incident } from '../interfaces/incident';
import { ActivatedRoute } from '@angular/router';
import { IncidentStatusPipe } from '../pipe/incident-status.pipe';
import { IncidentTypePipe } from '../pipe/incident-type.pipe';
import { TranslateDocumentTypePipe } from '../pipe/translate-document-type.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { IncidentDialogComponent } from '../incident-dialog/incident-dialog.component';
import Swal from 'sweetalert2';
import { History } from '../interfaces/history';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatCardModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    IncidentStatusPipe,
    IncidentTypePipe,
    TranslateDocumentTypePipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  incident: Incident = {
    id: 0,
    codigo: '',
    descripcion: '',
    asunto: '',
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    canal_id: 0,
    canal_nombre: 0,
    usuario_creador_id: 0,
    usuario_asignado_id: 0,
    persona_id: 0,
    estado_id: 0,
    tipo_id: 0
  }

  histories: History[] = [];
  isLoading: boolean = false;
  isAgentUser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private incidentService: IncidentService,
    private storageService: StorageService,
    private router: ActivatedRoute,
    private translate: TranslateService,
    private location: Location,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.isLoading = false;
    const lang = this.storageService.getItem("language")
    this.translate.use(lang ?? 'es')

    const id = this.router.snapshot.paramMap.get('id') ?? '';
    this.initializeData(id)

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["user_type"]);

    this.isAgentUser = (decoded["user_type"] === "agente")
  }

  initializeData(id: string | number) {
    this.incidentService.getIncidentById(id).subscribe({
      next: (incident: Incident) => {
        console.log(incident)
        this.incident = incident;
      }
    })

    this.incidentService.getHistoryByIncident(id).subscribe({
      next: (history: History[]) => {
        console.log(history)
        this.histories = history;
      }
    })
  }

  openManagementIncidence() {

    const dialogRef = this.dialog.open(IncidentDialogComponent, {
      width: '1000px',
      height: '700px',
      maxWidth: '2000px',
      disableClose: true,
      data: {
        incidentId: this.incident.id,
        status: this.incident.estado_id,
        assignedTo: this.incident.usuario_asignado?.id
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (formData) => {
        if (formData) {
          this.isLoading = true;
          this.incidentService.updateIncident(this.incident.id, formData).subscribe({
            next: (result: any) => {

              console.log(result)
              this.translate.get(['UPDATE_INCIDENT_SUCCESS_MESSAGE', 'CONFIRM_BUTTON_TEXT'], { codigo: this.incident.codigo }).subscribe(translations => {
                const successMessage = translations['UPDATE_INCIDENT_SUCCESS_MESSAGE'];
                const textButtonSucces = translations['CONFIRM_BUTTON_TEXT'];

                Swal.fire({
                  icon: 'success',
                  title: successMessage,
                  confirmButtonText: textButtonSucces,
                  confirmButtonColor: '#82BDAE'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.initializeData(this.incident.id)
                  }
                });

                this.isLoading = false;
              });
            },
            error: (error) => {
              this.translate.get(['UPDATE_INCIDENT_ERROR_MESSAGE']).subscribe(translations => {
                const errorMessage = translations['UPDATE_INCIDENT_ERROR_MESSAGE'];
                this.isLoading = false;
    
                Swal.fire({
                  icon: 'error',
                  title: errorMessage,
                });
                this.isLoading = false;
                console.log(error);
              })
            }
          })
        }
      }
    });

  }

  goBack() {
    this.location.back()
  }

}
