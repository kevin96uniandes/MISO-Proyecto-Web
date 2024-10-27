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
  callForm!: FormGroup;
  audioSource: string = '';

  constructor(
    private translate: TranslateService,
    private storageService: StorageService,
    private incidentService: IncidentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
  ) {

  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    const selectedCall = history.state?.call;
    this.callForm = this.fb.group({
      nombre_grabacion: [selectedCall.nombre_grabacion],
      duracion: [selectedCall.duracion],
      fecha_hora_llamada: [selectedCall.fecha_hora_llamada]
    });
    this.audioSource = "https://storage.googleapis.com/abcall-bucket/incident-calls/" + selectedCall.nombre_grabacion
  }

  /*getCallDetails(): void {
    console.log(this.selectedCall);
    this.callForm.patchValue({
      nombre_grabacion: this.selectedCall?.nombre_grabacion,
      duracion: this.selectedCall?.duracion,
      fecha_hora_llamada: this.selectedCall?.fecha_hora_llamada
    });
    this.audioSource = "https://storage.cloud.google.com/abcall-bucket/incident-calls/" + this.selectedCall?.nombre_grabacion
  }*/

  goBack() {
    this.location.back()
  }
}
