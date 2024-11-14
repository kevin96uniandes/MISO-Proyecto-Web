import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IncidentService } from '../incident.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../interfaces/product';
import { Call } from '../../call/calls';
import { Incident } from '../interfaces/incident';
import { Person } from '../../auth/person';
import { Router } from '@angular/router';
import { TranslateDocumentTypePipe } from '../pipe/translate-document-type.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    TranslateDocumentTypePipe
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
  selectedCall: Call | null = null;

  constructor(private incidentService: IncidentService,
    private router: Router,
    private storageService: StorageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {

    const lang = this.storageService.getItem("language")
    console.log(lang)

    this.translate.use(lang || 'es')

    if(history.state){
      this.person = history.state?.person;
    }
  }

  ngAfterViewInit() {

    this.incidentService.getIncidentByIdPerson(this.person.id).subscribe({
      next: (incidents: Incident[]) => {
        this.dataIncidents = new MatTableDataSource<Incident>(incidents);
        this.dataIncidents.paginator = this.paginatorIncidents;
        this.cdr.detectChanges();
      }
    })


    this.incidentService.getCallsByIdPerson(this.person.id).subscribe({
      next: (calls: Call[]) => {
        this.dataCalls = new MatTableDataSource<Call>(calls);
        this.dataCalls.paginator = this.paginatorCalls;
        this.cdr.detectChanges();
      }
    })

    this.incidentService.getProductsByPerson(this.person.id).subscribe({
      next: (products: Product[]) => {
        this.dataProducts = new MatTableDataSource<Product>(products);
        this.dataProducts.paginator = this.paginatorProducts;
        this.ranking = products.length;
        this.cdr.detectChanges();
      }
    })

  }

  createIncident() {
    this.router.navigate(['/dashboard/incident'], { state: { person: this.person } });
  }

  watchCallDetail(callId: number) {
    this.incidentService.getCallById(callId).subscribe({
      next: (call: Call) => {
        this.selectedCall = call;
        console.log(this.selectedCall);
        this.router.navigate(['/dashboard/details-call'], { state: { call: this.selectedCall } });
      },
      error: (err) => {
        console.error('Error al obtener los detalles de la llamada', err);
      }
    });
  }

  watchIncidentDetail(incident: Incident) {
    this.router.navigate(['/dashboard/incident/detail/', incident.id]);
  }
}
