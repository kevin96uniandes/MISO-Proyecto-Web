import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../common/storage.service';
import { BoardService } from './board.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let boardService: jasmine.SpyObj<BoardService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    const boardServiceSpy = jasmine.createSpyObj('BoardService', ['getIncidentPercentage', 'getIncidentSummary']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCardModule,
        MatIconModule,
        NgApexchartsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule // Add this line
      ],
      providers: [
        FormBuilder,
        { provide: BoardService, useValue: boardServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    boardService = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    storageService.getItem.and.returnValue('es');
    boardService.getIncidentPercentage.and.returnValue(of({"channels": [{"channel":"Llamada Telefónica", "value": 30}, {"channel":"Correo Electrónico", "value": 40}, {"channel":"App Movil", "value": 30} ]}));
    boardService.getIncidentSummary.and.returnValue(of({ incidentes: [], total: 0 }));
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize filter form correctly', () => {
    fixture.detectChanges();
    expect(component.filterForm.value).toEqual({
      canal_id: '',
      estado_id: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
  });

  it('should get incident percentage data on init', () => {
    fixture.detectChanges();
    component.getIncidentPercentage(component.filterForm.value);
    expect(boardService.getIncidentPercentage).toHaveBeenCalled();
    expect(component.phoneCallPercentage).toBe(30);
    expect(component.emailPercentage).toBe(40);
    expect(component.appPercentage).toBe(30);
  });

  it('should get incident summary data on init', () => {
    fixture.detectChanges();
    component.getIncidentSummary(component.filterForm.value);
    expect(boardService.getIncidentSummary).toHaveBeenCalled();
  });

  it('should update chart data after getting incident summary', () => {
    const sampleIncidents = [
      {
        estado: 'Abierto',
        canal: 'Llamada Telefónica',
        fecha_actualizacion: '2023-10-10T00:00:00',
        asunto: 'Asunto 1',
        codigo: '123',
        fecha_creacion: '2023-10-01T00:00:00',
        id: 1,
        tipo: 'Tipo 1'
      },
      {
        estado: 'Cerrado Satisfactoriamente',
        canal: 'Correo Electrónico',
        fecha_actualizacion: '2023-10-11T00:00:00',
        asunto: 'Asunto 2',
        codigo: '456',
        fecha_creacion: '2023-10-02T00:00:00',
        id: 2,
        tipo: 'Tipo 2'
      }
    ];

    boardService.getIncidentSummary.and.returnValue(of({ incidentes: sampleIncidents, total: sampleIncidents.length }));

    fixture.detectChanges();
    component.getIncidentSummary(component.filterForm.value);

    expect(component.dataSource.data).toEqual(sampleIncidents);
    expect(component.chartOptionsLine.series.length).toBeGreaterThan(0);
  });

  it('should apply filters and update data on form submit', () => {
    fixture.detectChanges();

    const filterValues = {
      canal_id: 1,
      estado_id: 2,
      fecha_inicio: '2023-01-01',
      fecha_fin: '2023-12-31'
    };
    component.filterForm.setValue(filterValues);

    const expectedFilters = {
      canal_id: 1,
      estado_id: 2,
      fecha_inicio: '2022-12-31',
      fecha_fin: '2023-12-30'
    };

    component.onSubmit();

    expect(boardService.getIncidentPercentage).toHaveBeenCalledWith(expectedFilters);
    expect(boardService.getIncidentSummary).toHaveBeenCalledWith(expectedFilters);
  });


  it('should reset filters and update data on clearFilters', () => {
    fixture.detectChanges();
    component.clearFilters();
    expect(component.filterForm.value).toEqual({
      canal_id: null,
      estado_id: null,
      fecha_inicio: null,
      fecha_fin: null
    });
    expect(boardService.getIncidentPercentage).toHaveBeenCalled();
    expect(boardService.getIncidentSummary).toHaveBeenCalled();
  });


});
