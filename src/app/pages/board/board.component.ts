import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../common/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Boardpercentage } from './interfaces/boardpercentage';
import { Incidentsummary } from './interfaces/boardsummary';
import { BoardService } from './board.service';
import { Boardfilter } from './interfaces/boardfilter';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexAxisChartSeries, ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { Incident } from './interfaces/incident';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

const estadoMap: { [key: string]: string } = {
  "1": "Abierto",
  "2": "Desestimado",
  "3": "Escalado",
  "4": "Cerrado Satisfactoriamente",
  "5": "Cerrado Insatisfactoriamente",
  "6": "Reaperturado"
};

const canalMap: { [key: string]: string } = {
  "1": "Llamada Telefónica",
  "2": "Correo Electrónico",
  "3": "App Movil"
};

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class BoardComponent implements OnInit {
  filterForm!: FormGroup;
  incidentPercentage: Boardpercentage | null = null;
  incidentSummary: Incidentsummary | null = null;

  phoneCallPercentage: number = 0;
  emailPercentage: number = 0;
  appPercentage: number = 0;

  displayedColumns: string[] = ['codigo', 'estado', 'canal', 'tipo', 'fecha_actualizacion'];
  dataSource = new MatTableDataSource<Incident>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public chartOptionsPie!: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
    title: ApexTitleSubtitle;
  };

  public chartOptionsLine!: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    stroke: ApexStroke;
  };

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private storageService: StorageService,
    private boardService: BoardService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      canal_id: [''],
      state: [''],
      start_date: [''],
      end_date: ['']
    });

    this.translate.get(['TITLE_PIE_CHART', 'TITLE_LINES_CHART']).subscribe(translations => {
      const titlePieChart = translations['TITLE_PIE_CHART'];
      const titleLinesChart = translations['TITLE_LINES_CHART'];
      this.chartOptionsPie = {
        series: [],
        chart: {
          type: 'pie',
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ],
        title: {
          text: titlePieChart,
          align: 'center',
          offsetY: 13,
          style: {
            fontSize: '1.25em',
            fontWeight: 'bold',
            color: '#126173',
            fontFamily: 'Roboto'
          }
        }
      };

      this.chartOptionsLine = {
        series: [],
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: []
        },
        title: {
          text: 'Incidentes por Estado y Fecha de Actualización',
          align: 'center',
          offsetY: 13,
          style: {
            fontSize: '1.25em',
            fontWeight: 'bold',
            color: '#126173',
            fontFamily: 'Roboto'
          }
        },
        stroke: {
          curve: 'smooth'
        }
      };
    });

    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    this.dataSource.filterPredicate = (data: Incident, filter: string) => {
      const filters: Boardfilter = JSON.parse(filter);

      const canalName = canalMap[filters.canal_id];
      const isCanalValid = !filters.canal_id || data.canal === canalName;

      const estadoName = estadoMap[String(filters.state)];
      const isStateValid = !filters.state || data.estado === estadoName;

      const isDateValid = (!filters.start_date || new Date(data.fecha_actualizacion) >= new Date(filters.start_date)) &&
                          (!filters.end_date || new Date(data.fecha_actualizacion) <= new Date(filters.end_date));

      return isCanalValid && isStateValid && isDateValid;
    };

    this.getIncidentPercentage(this.filterForm.value);
    this.getIncidentSummary(this.filterForm.value);

  }

  onSubmit() {
    const filters: Boardfilter = this.filterForm.value;
    this.getIncidentPercentage(filters);
    this.getIncidentSummary(filters);

    this.dataSource.filter = JSON.stringify(filters);
  }

  private getIncidentPercentage(filters: Boardfilter) {
    this.boardService.getIncidentPercentage(filters).subscribe(
      (response) => {
        this.incidentPercentage = response;
        this.phoneCallPercentage = response["Llamada Telefónica"] || 0;
        this.emailPercentage = response["Correo Electrónico"] || 0;
        this.appPercentage = response["App Movil"] || 0;
        this.cdr.markForCheck();
        console.log('Porcentaje de incidentes por canal:', response);
      },
      (error) => {
        console.error('Error al obtener el porcentaje de incidentes:', error);
      }
    );
  }

  private getIncidentSummary(filters: Boardfilter) {
    this.boardService.getIncidentSummary(filters).subscribe(
      (response) => {
        this.incidentSummary = response;

        this.dataSource.data = response.incidentes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filter = JSON.stringify(filters);

        this.updateChartData(response.incidentes);
        console.log('Resumen de incidentes:', response);
      },
      (error) => {
        console.error('Error al obtener el resumen de incidentes:', error);
      }
    );
  }

  private updateChartData(incidentes: Incident[]): void {
    const estadoCounts: { [key: string]: number } = {};
    const estadoFiltradoCodigo = String(this.filterForm.value.state);
    const estadoFiltrado = estadoMap[estadoFiltradoCodigo];
    const fechaEstadoCounts: { [fecha: string]: { [estado: string]: number } } = {};

    incidentes.forEach((incident) => {
      const estadoKey = String(incident.estado).trim();
      estadoCounts[estadoKey] = (estadoCounts[estadoKey] || 0) + 1;
      const fecha = incident.fecha_actualizacion.split('T')[0];

      if (!fechaEstadoCounts[fecha]) {
        fechaEstadoCounts[fecha] = {};
      }
      fechaEstadoCounts[fecha][estadoKey] = (fechaEstadoCounts[fecha][estadoKey] || 0) + 1;
    });

    const fechas = Object.keys(fechaEstadoCounts).sort();

    let seriesData;
    if (estadoFiltrado && estadoCounts[estadoFiltrado]) {
      seriesData = [{
        name: estadoFiltrado,
        data: fechas.map((fecha) => fechaEstadoCounts[fecha][estadoFiltrado] || 0)
      }];
      this.chartOptionsLine.title.text = `Incidentes de ${estadoFiltrado} por Fecha`;
    } else {
      seriesData = Object.keys(estadoMap).map((codigo) => {
        const estado = estadoMap[codigo];
        return {
          name: estado,
          data: fechas.map((fecha) => fechaEstadoCounts[fecha][estado] || 0)
        };
      });
      this.chartOptionsLine.title.text = 'Incidentes por Estado y Fecha de Actualización';
    }

    if (estadoFiltrado && estadoCounts[estadoFiltrado]) {
      this.chartOptionsPie = {
        ...this.chartOptionsPie,
        series: [estadoCounts[estadoFiltrado]],
        labels: [estadoFiltrado]
      };
    } else {
      this.chartOptionsPie = {
        ...this.chartOptionsPie,
        series: Object.values(estadoCounts),
        labels: Object.keys(estadoCounts)
      };
    }

    this.chartOptionsLine = {
      ...this.chartOptionsLine,
      series: seriesData,
      xaxis: {
        categories: fechas
      }
    };

    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.getIncidentPercentage(this.filterForm.value);
    this.getIncidentSummary(this.filterForm.value);
    this.dataSource.filter = '';
  }
}
