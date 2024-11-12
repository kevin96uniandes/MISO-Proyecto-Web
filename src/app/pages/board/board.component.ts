import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexTitleSubtitle } from 'ng-apexcharts';
import { Incident } from './interfaces/incident';
import { NgApexchartsModule } from 'ng-apexcharts';

const estadoMap: { [key: string]: string } = {
  "1": "Abierto",
  "2": "Desestimado",
  "3": "Escalado",
  "4": "Cerrado Satisfactoriamente",
  "5": "Cerrado Insatisfactoriamente",
  "6": "Reaperturado"
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
    NgApexchartsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class BoardComponent implements OnInit {
  filterForm: FormGroup;
  incidentPercentage: Boardpercentage | null = null;
  incidentSummary: Incidentsummary | null = null;

  phoneCallPercentage: number = 0;
  emailPercentage: number = 0;
  appPercentage: number = 0;

  public chartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
    title: ApexTitleSubtitle;
  };

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private storageService: StorageService,
    private boardService: BoardService,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      canal_id: [''],
      state: [''],
      start_date: [''],
      end_date: ['']
    });
    this.chartOptions = {
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
        text: 'Distribución de Incidentes por Estado',
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
  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')
    this.getIncidentPercentage(this.filterForm.value);
    this.getIncidentSummary(this.filterForm.value);

  }

  onSubmit() {
    const filters: Boardfilter = this.filterForm.value;
    this.getIncidentPercentage(filters);
    this.getIncidentSummary(filters);
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

    console.log('Estado filtrado', estadoFiltrado);

    incidentes.forEach((incident) => {
      const estadoKey = String(incident.estado).trim();
      estadoCounts[estadoKey] = (estadoCounts[estadoKey] || 0) + 1;
      console.log(`Estados count en el foreach (clave: "${estadoKey}")`, estadoCounts[estadoKey]);
    });
    console.log('Estados count', estadoCounts);
    console.log('Valor específico de estadoFiltrado:', estadoCounts[estadoFiltrado]);

    if (estadoFiltrado && estadoCounts[estadoFiltrado]) {
      this.chartOptions = {
        ...this.chartOptions,
        series: [estadoCounts[estadoFiltrado]],
        labels: [estadoFiltrado]
      };
      console.log('Entra en el estado filtrado');
    } else {
      this.chartOptions = {
        ...this.chartOptions,
        series: Object.values(estadoCounts),
        labels: Object.keys(estadoCounts)
      };
      console.log('Entra en todos los estados');
    }

    this.cdr.markForCheck();
  }
}
