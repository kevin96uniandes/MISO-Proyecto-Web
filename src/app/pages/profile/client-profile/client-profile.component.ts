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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { Agente } from '../../auth/user';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TranslateDocumentTypePipe } from '../../incident/pipe/translate-document-type.pipe';
import { CommonModule } from '@angular/common';

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
    MatButtonToggleModule,
    CommonModule,
    TranslateDocumentTypePipe
  ],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataIncidences!: MatTableDataSource<Incident>
  dataAgents!: MatTableDataSource<Agente>
  
  documentTypes = {
    1: "Cédula de ciudadania",
    2: "Cédula de extrangería"
  }

  userResponse: any | null = null;
  companyResponse: any | null = null;
  userName: string | null = null;
  documentType: string | null = null;
  documentTypeString: string | null = null;
  documentNumber: string | null = null;
  lastUpdate: string | null = null;
  phone: string | null = null;
  email: string | null = null;
  companyId: number | null = null;
  userType: string | null = null;

  displayedColumns: string[] = ['acciones', 'code', 'description', 'subject', 'createdAt', 'updatedAt'];
  dataIncidents!: MatTableDataSource<Incident>

  agentDisplayedColumns: string[] = ['acciones', 'nombreUsuario', 'identificacion', 'nombreCompleto', 'correoElectronico', 'telefono'];

  selectedValue: string = '';
  
  constructor(
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService
  ) { }
  
  ngAfterViewInit() {
    const lang = this.storageService.getItem("language")
    this.selectedValue = lang || 'es';
    this.translate.use(this.selectedValue)

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    

    let userId = decoded["id"];
    this.userType = decoded["user_type"]
    
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
      },
      (error) => {
        console.error('Error al obtener el plan activo:', error);
        this.userResponse = null;
      }
    );

    let companyId = decoded["id_company"];

    this.profileService.getCompanyById(companyId).subscribe(
      (response) => {
        console.log(response)
        this.companyResponse = response;

        if (this.companyResponse["tipo_identificacion"] == 1) {
          this.documentType = "Cédula de ciudadania"
        }else if (this.companyResponse["tipo_identificacion"] == 2) {
          this.documentType = "NIT"
        }else if (this.companyResponse["tipo_identificacion"] == 3){
          this.documentType = "Cédula de extrangeria"
        }

        this.documentNumber = this.companyResponse["numero_identificacion"]   
        this.lastUpdate = this.companyResponse["fecha_actualizacion"].split("T")[0]
        this.phone = this.companyResponse["telefono"]
        this.email = this.companyResponse["email"]
      },
      (error) => {
        console.error('Error al obtener el plan activo:', error);
        this.userResponse = null;
      }
    )

    this.profileService.getAgentsByIdCompany(companyId).subscribe({
      next: (agents: Agente[]) => {
        console.log(agents);

        this.dataAgents = new MatTableDataSource<Agente>(agents);
        this.dataAgents.paginator = this.paginator;
        this.dataAgents.sort = this.sort;

        this.cdr.detectChanges();
      }
    })

  }

  goToIncidentDetail(id: number){
    this.router.navigate(['/dashboard/incident/detail/', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAgents.filter = filterValue.trim().toLowerCase();

    if (this.dataAgents.paginator) {
      this.dataAgents.paginator.firstPage();
    }
  }
}
