import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Incident } from '../../incident/interfaces/incident';
import { StorageService } from '../../../common/storage.service';
import { ProfileService } from '../profile.service';
import { ListService } from '../../list/list.service';
import {ChangeDetectionStrategy } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { Agente } from '../../auth/user';

import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [    
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    FormsModule,
    TranslateModule,
    MatCardModule, 
    MatChipsModule, 
    MatProgressBarModule,
    RouterModule,
    MatButtonToggleModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements AfterViewInit {

  dataAgents!: MatTableDataSource<Agente>

  documentTypes = {
    1: "Cédula de ciudadania",
    2: "Cédula de extrangería"
  }

  userResponse: any | null = null;
  userName: string | null = null;
  documentType: string | null = null;
  documentTypeString: string | null = null;
  documentNumber: string | null = null;
  lastUpdate: string | null = null;
  phone: string | null = null;
  email: string | null = null;

  displayedColumns: string[] = ['acciones', 'code', 'description', 'subject', 'createdAt', 'updatedAt'];
  dataIncidents!: MatTableDataSource<Incident>

  agentDisplayedColumns: string[] = ['acciones', 'nombreUsuario', 'identificacion', 'nombreCompleto', 'correoElectronico', 'telefono'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private listAgentService: ListService,
    
  ) { }

  ngAfterViewInit() {
    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    
    let userId = decoded["id"];
    

    this.profileService.getIncidences().subscribe({
      next: (incidents: Incident[]) => {
        
        this.dataIncidents = new MatTableDataSource<Incident>(incidents);
        this.dataIncidents.paginator = this.paginator;
        this.dataIncidents.sort = this.sort;

        this.cdr.detectChanges();
      }
    })


    this.profileService.getUser(userId).subscribe(
      (response) => {
        console.log(response)
        this.userResponse = response;
        this.userName = this.userResponse["nombre_usuario"]
        this.documentType = this.userResponse["persona"]["tipo_identificacion"]
        this.documentNumber = this.userResponse["persona"]["numero_identificacion"]   
        this.lastUpdate = this.userResponse["fecha_actualizacion"]
        this.phone = this.userResponse["persona"]["telefono"]
        this.email = this.userResponse["persona"]["correo_electronico"]
      },
      (error) => {
        console.error('Error al obtener el plan activo:', error);
        this.userResponse = null;
      }
    );

    let empresa_id = decoded["id_company"];

    this.listAgentService.getAgentsByIdCompany(empresa_id).subscribe({
      next: (agents: Agente[]) => {
        console.log(agents);

        this.dataAgents = new MatTableDataSource<Agente>(agents);
        this.dataAgents.paginator = this.paginator;
        this.dataAgents.sort = this.sort;

        this.cdr.detectChanges();
      }
    })

  }

}
