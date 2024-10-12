import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IncidentService } from '../incident.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../product';
import { Call } from '../calls';
import { Incident } from '../incident';
import { Person } from '../../auth/person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements AfterViewInit {

  @ViewChild('paginatorProducts', { read: MatPaginator }) paginatorProducts!: MatPaginator;
  @ViewChild('paginatorCalls', { read: MatPaginator }) paginatorCalls!: MatPaginator;
  @ViewChild('paginatorIncidents', { read: MatPaginator }) paginatorIncidents!: MatPaginator;

  displayedColumnsProducts: string[] = ['name', 'category', 'date_of_acquisition'];
  displayedColumnsCalls: string[] = ['watch', 'duration', 'call_date'];
  displayedColumnsIncidents: string[] = ['watch', 'subject_incident', 'status', 'creation_date'];
  ranking = 50;
  person!: Person;

  dataProducts!: MatTableDataSource<Product>;
  dataCalls!: MatTableDataSource<Call>;
  dataIncidents!: MatTableDataSource<Incident>;

  constructor(private incidentService: IncidentService, 
    private router: Router) { }

  ngOnInit(): void {
    this.person = history.state?.person;

  }

  ngAfterViewInit() {

    this.incidentService.getIncidentByIdPerson(this.person.id).subscribe({
      next: (incidents: Incident[]) => {
        this.dataIncidents = new MatTableDataSource<Incident>(incidents);
        this.dataIncidents.paginator = this.paginatorIncidents;
      }
    })

    
    this.incidentService.getCallsByIdPerson(this.person.id).subscribe({
      next: (calls: Call[]) => {
        this.dataCalls = new MatTableDataSource<Call>(calls);
        this.dataCalls.paginator = this.paginatorCalls;
      }
    })

    this.incidentService.getProductsByPerson(this.person.id).subscribe({
      next: (products: Product[]) => {
        this.dataProducts = new MatTableDataSource<Product>(products);
        this.dataProducts.paginator = this.paginatorProducts;
        this.ranking = products.length;
      }
    })

  }

  createIncident() {
    this.router.navigate(['/dashboard/incident'], { state: { person: this.person } });
  }

  watchCallDetail(call: Call) {
    console.log(call)
  }

  watchIncidentDetail(incident: Incident) {
    console.log(incident)
  }
}
