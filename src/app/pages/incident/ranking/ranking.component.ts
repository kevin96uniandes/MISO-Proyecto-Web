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

  displayedColumnsProducts: string[] = ['name', 'company_name', 'date_of_acquisition'];
  displayedColumnsCalls: string[] = ['watch', 'duration', 'call_date'];
  displayedColumnsIncidents: string[] = ['watch', 'subject_incident', 'status', 'creation_date'];
  ranking = 50;

  ELEMENT_DATA: Product[] = [
    { name: 'prueba1', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba2', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba3', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba4', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba5', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba6', company_name: 'TIGO', date_of_acquisition: '01/01/2001' },
    { name: 'prueba7', company_name: 'TIGO', date_of_acquisition: '01/01/2001' }
  ]

  ELEMENT_CALLS: Call[] = [
    {
      id: 1,
      nombre_grabacion: "grabacion_1.mp3",
      duracion: "10:30",
      fecha_hora_llamada: new Date('2022-01-02T10:30:00'),
      fecha_creacion: new Date('2022-01-02T11:00:00'),
      fecha_actualizacion: new Date('2022-01-02T12:00:00'),
      incidencia_id: 101,
      persona_id: 1001,
      usuario_id: 501
    },
    {
      id: 2,
      nombre_grabacion: "grabacion_2.mp3",
      duracion: "05:20",
      fecha_hora_llamada: new Date('2022-01-02T09:00:00'),
      fecha_creacion: new Date('2022-01-02T09:30:00'),
      fecha_actualizacion: new Date('2022-01-02T10:00:00'),
      incidencia_id: 102,
      persona_id: 1002,
      usuario_id: 502
    },
    {
      id: 3,
      nombre_grabacion: "grabacion_3.mp3",
      duracion: "20:05",
      fecha_hora_llamada: new Date('2022-01-02T13:30:00'),
      fecha_creacion: new Date('2022-01-02T14:00:00'),
      fecha_actualizacion: new Date('2022-01-02T15:00:00'),
      incidencia_id: 103,
      persona_id: 1003,
      usuario_id: 503
    },
    {
      id: 4,
      nombre_grabacion: "grabacion_4.mp3",
      duracion: "15:45",
      fecha_hora_llamada: new Date('2022-01-03T08:15:00'),
      fecha_creacion: new Date('2022-01-03T09:00:00'),
      fecha_actualizacion: new Date('2022-01-03T10:00:00'),
      incidencia_id: 104,
      persona_id: 1004,
      usuario_id: 504
    },
    {
      id: 5,
      nombre_grabacion: "grabacion_5.mp3",
      duracion: "07:50",
      fecha_hora_llamada: new Date('2022-01-03T10:00:00'),
      fecha_creacion: new Date('2022-01-03T10:30:00'),
      fecha_actualizacion: new Date('2022-01-03T11:00:00'),
      incidencia_id: 105,
      persona_id: 1005,
      usuario_id: 505
    },
    {
      id: 6,
      nombre_grabacion: "grabacion_6.mp3",
      duracion: "12:10",
      fecha_hora_llamada: new Date('2022-01-03T11:00:00'),
      fecha_creacion: new Date('2022-01-03T11:30:00'),
      fecha_actualizacion: new Date('2022-01-03T12:00:00'),
      incidencia_id: 106,
      persona_id: 1006,
      usuario_id: 506
    },
    {
      id: 7,
      nombre_grabacion: "grabacion_7.mp3",
      duracion: "18:25",
      fecha_hora_llamada: new Date('2022-01-04T09:00:00'),
      fecha_creacion: new Date('2022-01-04T09:30:00'),
      fecha_actualizacion: new Date('2022-01-04T10:00:00'),
      incidencia_id: 107,
      persona_id: 1007,
      usuario_id: 507
    },
    {
      id: 8,
      nombre_grabacion: "grabacion_8.mp3",
      duracion: "03:40",
      fecha_hora_llamada: new Date('2022-01-04T12:30:00'),
      fecha_creacion: new Date('2022-01-04T13:00:00'),
      fecha_actualizacion: new Date('2022-01-04T13:30:00'),
      incidencia_id: 108,
      persona_id: 1008,
      usuario_id: 508
    },
    {
      id: 9,
      nombre_grabacion: "grabacion_9.mp3",
      duracion: "22:15",
      fecha_hora_llamada: new Date('2022-01-04T15:00:00'),
      fecha_creacion: new Date('2022-01-04T15:30:00'),
      fecha_actualizacion: new Date('2022-01-04T16:00:00'),
      incidencia_id: 109,
      persona_id: 1009,
      usuario_id: 509
    },
    {
      id: 10,
      nombre_grabacion: "grabacion_10.mp3",
      duracion: "09:55",
      fecha_hora_llamada: new Date('2022-01-05T08:30:00'),
      fecha_creacion: new Date('2022-01-05T09:00:00'),
      fecha_actualizacion: new Date('2022-01-05T09:30:00'),
      incidencia_id: 110,
      persona_id: 1010,
      usuario_id: 510
    }
  ];

  ELEMENTS_INCIDENT: Incident[] = [
    {
      id: 1,
      codigo: "INC-00123",
      descripcion: "El cliente reporta problemas de conectividad en la red.",
      asunto: "Problemas de red",
      fecha_creacion: new Date('2023-08-12T10:15:00'),
      fecha_actualizacion: new Date('2023-08-14T11:30:00'),
      canal_id: 3,
      usuario_creador_id: 21,
      usuario_asignado_id: 45,
      persona_id: 123,
      estado_id: 2,
      tipo_id: 1
    },
    {
      id: 2,
      codigo: "INC-00124",
      descripcion: "Error en la autenticación de usuarios en el sistema.",
      asunto: "Error de autenticación",
      fecha_creacion: new Date('2023-09-01T09:20:00'),
      fecha_actualizacion: new Date('2023-09-01T15:45:00'),
      canal_id: 2,
      usuario_creador_id: 25,
      usuario_asignado_id: 41,
      persona_id: 101,
      estado_id: 3,
      tipo_id: 2
    },
    {
      id: 3,
      codigo: "INC-00125",
      descripcion: "Falla en la base de datos, no permite acceder a los registros.",
      asunto: "Falla en la base de datos",
      fecha_creacion: new Date('2023-07-20T13:40:00'),
      fecha_actualizacion: new Date('2023-07-21T09:50:00'),
      canal_id: 1,
      usuario_creador_id: 34,
      usuario_asignado_id: 58,
      persona_id: 110,
      estado_id: 1,
      tipo_id: 3
    },
    {
      id: 4,
      codigo: "INC-00126",
      descripcion: "Cliente reporta factura errónea en su cuenta.",
      asunto: "Problema con facturación",
      fecha_creacion: new Date('2023-06-15T16:10:00'),
      fecha_actualizacion: new Date('2023-06-17T14:25:00'),
      canal_id: 4,
      usuario_creador_id: 19,
      usuario_asignado_id: 33,
      persona_id: 145,
      estado_id: 4,
      tipo_id: 1
    },
    {
      id: 5,
      codigo: "INC-00127",
      descripcion: "Problema de configuración en el correo electrónico del cliente.",
      asunto: "Error de configuración de correo",
      fecha_creacion: new Date('2023-05-25T12:00:00'),
      fecha_actualizacion: new Date('2023-05-26T13:10:00'),
      canal_id: 3,
      usuario_creador_id: 12,
      usuario_asignado_id: 22,
      persona_id: 137,
      estado_id: 5,
      tipo_id: 4
    },
    {
      id: 6,
      codigo: "INC-00128",
      descripcion: "El sistema se congela al intentar guardar datos.",
      asunto: "Sistema congelado",
      fecha_creacion: new Date('2023-10-01T08:30:00'),
      fecha_actualizacion: new Date('2023-10-02T10:45:00'),
      canal_id: 2,
      usuario_creador_id: 29,
      usuario_asignado_id: 50,
      persona_id: 122,
      estado_id: 2,
      tipo_id: 3
    },
    {
      id: 7,
      codigo: "INC-00129",
      descripcion: "El cliente no puede acceder a su cuenta desde el móvil.",
      asunto: "Problemas con la aplicación móvil",
      fecha_creacion: new Date('2023-09-15T11:20:00'),
      fecha_actualizacion: new Date('2023-09-16T13:40:00'),
      canal_id: 5,
      usuario_creador_id: 40,
      usuario_asignado_id: 61,
      persona_id: 109,
      estado_id: 3,
      tipo_id: 2
    }
  ];

  dataProducts = new MatTableDataSource<Product>(this.ELEMENT_DATA);
  dataCalls = new MatTableDataSource<Call>(this.ELEMENT_CALLS);
  dataIncidents = new MatTableDataSource<Incident>(this.ELEMENTS_INCIDENT);

  ngAfterViewInit() {
    this.dataProducts.paginator = this.paginatorProducts;
    this.dataCalls.paginator = this.paginatorCalls;
    this.dataIncidents.paginator = this.paginatorIncidents;
  }

  constructor(private rankingService: IncidentService) { }

  watchCallDetail(call: Call) {
    console.log(call)
  }

  watchIncidentDetail(incident: Incident) {
    console.log(incident)
  }


}
