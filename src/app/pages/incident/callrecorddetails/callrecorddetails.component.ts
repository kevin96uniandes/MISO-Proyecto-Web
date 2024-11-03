import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IncidentService } from '../incident.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../auth/user';
import { Call } from '../../call/calls';

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
    MatAutocompleteModule,
    CommonModule
  ],
})
export class CallrecorddetailsComponent implements OnInit {
  callForm!: FormGroup;
  audioSource: string = '';
  agents: User[] = [];
  selectedCall!: Call;

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

    if(history.state){
      this.selectedCall = history.state?.call;
    }
    
    if (this.selectedCall) {
      this.callForm = this.fb.group({
        nombre_grabacion: [this.selectedCall.nombre_grabacion],
        duracion: [this.selectedCall.duracion],
        fecha_hora_llamada: [this.selectedCall.fecha_hora_llamada]
      });
      this.audioSource = "https://storage.googleapis.com/abcall-bucket/incident-calls/" + this.selectedCall.nombre_grabacion
    }
  }

  goBack() {
    this.location.back()
  }
}
