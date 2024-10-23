import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Incident } from '../incident';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { IncidentService } from '../incident.service';
import { IncidentTypePipe } from '../pipe/incident-type.pipe';
import { IncidentStatusPipe } from '../pipe/incident-status.pipe';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    IncidentTypePipe,
    IncidentStatusPipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements AfterViewInit {

  filterCodeIncident!: string;  
  filterIdentityNumber!: string;
  filterStatus!: number;

  displayedColumns: string[] = ['actions', 'identificator', 'status', 'type', 'identiyNumberClient', 'clientName','openingDate'];
  dataIncident!: MatTableDataSource<Incident>
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void { 

    this.incidentService.getIncidents().subscribe({
      next: (incidents: Incident[]) => {
        console.log(incidents)

        this.dataIncident = new MatTableDataSource<Incident>(incidents);
        this.dataIncident.paginator = this.paginator;
        this.dataIncident.sort = this.sort;
    
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error)
      }
    });

  }

  applyFilters(): void {
    const filterValue = {
      identifier: this.filterCodeIncident?.trim().toLowerCase(),
      identityNumber: this.filterIdentityNumber?.trim().toLowerCase(),
      status: this.filterStatus
    };

    console.log(filterValue)
    this.dataIncident.filterPredicate = (data: Incident, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      const matchesIdentifier = searchTerms.identifier 
        ? data.codigo.toLowerCase().includes(searchTerms.identifier) 
        : true;
      const matchesIdentityNumber = searchTerms.identityNumber 
        ? (data.person ? data.person.numero_identificacion: '' ).toLowerCase().includes(searchTerms.identityNumber) 
        : true;
      const matchesStatus = searchTerms.status 
        ? data.estado_id == searchTerms.status 
        : true;
    
      return matchesIdentifier && matchesIdentityNumber && matchesStatus;

    };
    this.dataIncident.filter = JSON.stringify(filterValue);
  }

  clearFilters(){
    this.filterCodeIncident = '';
    this.filterIdentityNumber = '';
    this.filterStatus = 0;

    this.applyFilters()
  }


}
