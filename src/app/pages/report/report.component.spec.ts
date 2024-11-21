import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ReportService } from './report.service';
import { ReportComponent } from './report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from '../../common/storage.service';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let reportService: jasmine.SpyObj<ReportService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    const reportServiceSpy = jasmine.createSpyObj('ReportService', ['saveReport']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: ReportService, useValue: reportServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;

    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    storageService.getItem.and.returnValue('es');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.reportForm).toBeDefined();
    const formValues = component.reportForm.value;
    expect(formValues).toEqual({
      nombre_reporte: '',
      canal_id: '',
      estado_id: '',
      tipo_id: '',
      fecha_inicio: '',
      fecha_fin: '',
    });
  });

  it('should set the language from storageService on initialization', () => {
    const mockLanguage = 'language';
    spyOn(localStorage, 'getItem').and.returnValue(mockLanguage);

    component.ngOnInit();

    expect(storageService.getItem).toHaveBeenCalledWith(mockLanguage);
  });

  describe('saveReport', () => {
    it('should show an error message if the form is invalid', () => {
      component.reportForm.controls['nombre_reporte'].setValue('');

      component.saveReport();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Por favor completa todos los campos obligatorios.',
        'Cerrar',
        { duration: 3000 }
      );
    });

    it('should call saveReport on the service with processed data', () => {
      const mockResponse = new Blob(['mock data'], { type: 'application/pdf' });
      reportService.saveReport.and.returnValue(of(mockResponse));

      component.reportForm.setValue({
        nombre_reporte: 'Reporte Test',
        canal_id: '1',
        estado_id: '2',
        tipo_id: '3',
        fecha_inicio: '2023-11-01',
        fecha_fin: '2023-11-15',
      });

      component.saveReport();

      expect(reportService.saveReport).toHaveBeenCalledWith({
        nombre_reporte: 'Reporte Test',
        canal_id: '1',
        estado_id: '2',
        tipo_id: '3',
        fecha_inicio: '10/31/2023',
        fecha_fin: '11/14/2023',
      });

      expect(snackBar.open).toHaveBeenCalledWith(
        'Reporte guardado exitosamente.',
        'Cerrar',
        { duration: 7000 }
      );
    });

    it('should handle an error response and show an error message', () => {
      reportService.saveReport.and.returnValue(throwError(() => new Error('Error')));

      component.reportForm.setValue({
        nombre_reporte: 'Reporte Test',
        canal_id: '1',
        estado_id: '2',
        tipo_id: '3',
        fecha_inicio: '2023-11-01',
        fecha_fin: '2023-11-15',
      });

      component.saveReport();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error al guardar el reporte. Por favor intenta nuevamente.',
        'Cerrar',
        { duration: 5000 }
      );
    });
  });

  describe('clearFilters', () => {
    it('should reset the form and show a confirmation message', () => {
      component.reportForm.setValue({
        nombre_reporte: 'Test Report',
        canal_id: '1',
        estado_id: '2',
        tipo_id: '3',
        fecha_inicio: '2023-11-01',
        fecha_fin: '2023-11-15',
      });

      component.clearFilters();

      expect(component.reportForm.value).toEqual({
        nombre_reporte: '',
        canal_id: null,
        estado_id: null,
        tipo_id: null,
        fecha_inicio: null,
        fecha_fin: null,
      });

      expect(snackBar.open).toHaveBeenCalledWith('Filtros limpios.', 'Cerrar', { duration: 2000 });
    });
  });
});
