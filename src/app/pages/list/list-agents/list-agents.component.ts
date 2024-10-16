import { Component, ViewChild, NgModule, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

export interface Agente {
  identificacion: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
}

const AGENTES_DATA: Agente[] = [
  { identificacion: '7719271793', nombreCompleto: 'Celestina Muffin', correoElectronico: 'mdone1@ft.com', telefono: '7859224631' },
  { identificacion: '5028391440', nombreCompleto: 'Melisent Done', correoElectronico: 'mjog@gmail.com', telefono: '1912271818' },
  { identificacion: '5016423245', nombreCompleto: 'Goldia Castagna', correoElectronico: 'gcastagna2@e-recht24.de', telefono: '0588155659' },
  { identificacion: '7466293565', nombreCompleto: 'Wyatan Sacco', correoElectronico: 'wsacco3@furl.net', telefono: '0767189159' },
  { identificacion: '6929037893', nombreCompleto: 'Merilee Higgonet', correoElectronico: 'mhiggonet4@pinterest.com', telefono: '2319392521' },
  { identificacion: '7806754067', nombreCompleto: 'Jemima Moseley', correoElectronico: 'jmoseley5@cornell.edu', telefono: '1443313017' },
  { identificacion: '3691614221', nombreCompleto: 'Florance Emeline', correoElectronico: 'femeline6@oracle.com', telefono: '1234567890' },
  { identificacion: '3571446240', nombreCompleto: 'Berni Cossam', correoElectronico: 'bcossam7@geocities.com', telefono: '6017968912' },
  { identificacion: '1986410595', nombreCompleto: 'Gabey Dripps', correoElectronico: 'gdripps8@prnewswire.com', telefono: '3226883887' },
  { identificacion: '5003653514', nombreCompleto: 'Giorgi Kilsby', correoElectronico: 'gkilsby9@jigsy.com', telefono: '8266419752' },
];

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
  ],
  templateUrl: './list-agents.component.html',
  styleUrls: ['./list-agents.component.scss']
})
export class ListAgentsComponent implements AfterViewInit {
  displayedColumns: string[] = ['acciones', 'identificacion', 'nombreCompleto', 'correoElectronico', 'telefono'];
  dataSource = new MatTableDataSource<Agente>(AGENTES_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  createAgent() {
    this.router.navigate(['/register/agent']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

