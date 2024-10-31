import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { DetailComponent } from './detail.component';
import { IncidentService } from '../incident.service';
import { StorageService } from '../../../common/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Incident } from '../interfaces/incident';
import { History } from '../interfaces/history';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let activatedRoute: ActivatedRoute;
  let translateServiceMock: any;
  let translateService: any;

  beforeEach(async () => {

    const incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getIncidentById', 'getHistoryByIncident', 'updateIncident']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const activatedRouteSpy = { snapshot: { paramMap: { get: () => '1' } } };

    const mockIncident: Incident = { id: 1, codigo: '001', descripcion: 'Incident description', asunto: 'Incident subject', fecha_creacion: new Date(), fecha_actualizacion: new Date(), canal_id: 1, canal_nombre: 1, usuario_creador_id: 1, usuario_asignado_id: 2, persona_id: 1, estado_id: 1, tipo_id: 1 };
    const mockHistory: History[] = [{ id: '1', estado_id: 1, incidencia_id: 1, observaciones: 'observaciones test', fecha_creacion: '', usuario_asignado_id: 1, usuario_creador_id: 1}];

    incidentServiceSpy.getIncidentById.and.returnValue(of(mockIncident));
    incidentServiceSpy.getHistoryByIncident.and.returnValue(of(mockHistory));

    storageServiceSpy.getItem.and.returnValue(JSON.stringify({ user_type: 'agente' }));  


    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get']);
    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({})); 
    translateServiceMock.use.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DetailComponent, BrowserAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        {
          provide: Location,
          useValue: { back: jasmine.createSpy('back') }, 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should initialize data on ngOnInit', fakeAsync(() => {
    const mockIncident: Incident = { id: 1, codigo: '001', descripcion: 'Incident description', asunto: 'Incident subject', fecha_creacion: new Date(), fecha_actualizacion: new Date(), canal_id: 1, canal_nombre: 1, usuario_creador_id: 1, usuario_asignado_id: 2, persona_id: 1, estado_id: 1, tipo_id: 1 };
    const mockHistory: History[] = [{ id: '1', estado_id: 1, incidencia_id: 1, observaciones: 'observaciones test', fecha_creacion: '', usuario_asignado_id: 1, usuario_creador_id: 1}];

    incidentService.getIncidentById.and.returnValue(of(mockIncident));
    incidentService.getHistoryByIncident.and.returnValue(of(mockHistory));
    storageService.getItem.and.returnValue(JSON.stringify({ user_type: 'agente' }));

    component.ngOnInit();
    tick();

    expect(component.incident).toEqual(mockIncident);
    expect(component.histories).toEqual(mockHistory);
    expect(component.isAgentUser).toBeTrue();
  }));

  it('should open management incident dialog and handle success update', fakeAsync(() => {
    const mockDialogRef = jasmine.createSpyObj({ afterClosed: of({ status: 'updated' }), close: null });
    dialog.open.and.returnValue(mockDialogRef);
    incidentService.updateIncident.and.returnValue(of({}));

    component.openManagementIncidence();
    tick(500); 
    flush();

    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should handle update error in openManagementIncidence', fakeAsync(() => {
    const mockDialogRef = jasmine.createSpyObj({ afterClosed: of({ status: 'updated' }), close: null });
    dialog.open.and.returnValue(mockDialogRef);
    incidentService.updateIncident.and.returnValue(of({ status: 'error' }));

    component.openManagementIncidence();
    tick();
    flush();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should call goBack and navigate back', () => {
    const location = TestBed.inject(Location);

    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
  it('should handle error on incident update', fakeAsync(() => {

    const mockDialogRef = jasmine.createSpyObj({ afterClosed: of({ status: 'error' }), close: null });
    dialog.open.and.returnValue(mockDialogRef);
    incidentService.updateIncident.and.returnValue(throwError(() => new Error('Error de prueba'))); // Simula el error en el servicio
    spyOn(Swal, 'fire');
  
    component.openManagementIncidence();
    tick();
  
    expect(dialog.open).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));
});
