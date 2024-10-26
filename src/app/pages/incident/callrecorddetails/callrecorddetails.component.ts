import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IncidentService } from '../incident.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Call } from '../calls';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-callrecorddetails',
  standalone: true,
  templateUrl: './callrecorddetails.component.html',
  styleUrls: ['./callrecorddetails.component.scss'],
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class CallrecorddetailsComponent implements OnInit {
  callForm: FormGroup;
  audioSource: string = '';

  constructor(
    private translate: TranslateService,
    private storageService: StorageService,
    private incidentService: IncidentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.callForm = this.fb.group({
      nombre_grabacion: [''],
      duracion: [''],
      fecha_hora_llamada: ['']
    });
  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    const callId = this.route.snapshot.params['id'];
    this.getCallDetails(callId);
  }

  getCallDetails(callId: number): void {
    this.incidentService.getCallById(callId).subscribe(
      (call: Call) => {
        this.callForm.patchValue({
          nombre_grabacion: call.nombre_grabacion,
          duracion: call.duracion,
          fecha_hora_llamada: call.fecha_hora_llamada
        });
        this.audioSource = "https://storage.cloud.google.com/abcall-bucket/incident-calls/" + call.nombre_grabacion
      },
      (error) => {
        console.error('Error al obtener los detalles de la llamada', error);
      }
    );
  }

  get nombreGrabacionControl(): FormControl {
    return this.callForm.get('nombre_grabacion') as FormControl;
  }

  get duracionControl(): FormControl {
    return this.callForm.get('duracion') as FormControl;
  }

  get fechaHoraLlamadaControl(): FormControl {
    return this.callForm.get('fecha_hora_llamada') as FormControl;
  }

  goBack() {
    this.location.back()
  }
}
