import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
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
    TranslateModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements AfterViewInit {

  displayedColumns: string[] = ['acciones', 'code', 'description', 'subject', 'createdAt', 'updatedAt'];
  dataIncidents!: MatTableDataSource<Incident>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService
  ) { }

  ngAfterViewInit() {
    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    
    this.profileService.getIncidences().subscribe({
      next: (incidents: Incident[]) => {
        
        this.dataIncidents = new MatTableDataSource<Incident>(incidents);
        this.dataIncidents.paginator = this.paginator;
        this.dataIncidents.sort = this.sort;

        this.cdr.detectChanges();
      }
    })

  }

}
