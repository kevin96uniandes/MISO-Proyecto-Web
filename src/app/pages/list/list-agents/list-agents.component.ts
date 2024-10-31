import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ListService } from '../list.service';
import { StorageService } from '../../../common/storage.service';
import { Agente } from '../../auth/user';

@Component({
  selector: 'app-list-agents',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './list-agents.component.html',
  styleUrls: ['./list-agents.component.scss']
})
export class ListAgentsComponent implements AfterViewInit {
  displayedColumns: string[] = ['acciones', 'nombreUsuario', 'identificacion', 'nombreCompleto', 'correoElectronico', 'telefono'];
  dataAgents!: MatTableDataSource<Agente>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private listAgentService: ListService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["id_company"]);

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

  createAgent() {
    this.router.navigate(['/dashboard/register/agent']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAgents.filter = filterValue.trim().toLowerCase();

    if (this.dataAgents.paginator) {
      this.dataAgents.paginator.firstPage();
    }
  }
}
