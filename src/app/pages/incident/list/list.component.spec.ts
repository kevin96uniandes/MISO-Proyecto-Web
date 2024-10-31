import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { IncidentService } from '../incident.service';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Incident } from '../interfaces/incident';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let incidentServiceSpy: any;
  let storageService: jasmine.SpyObj<StorageService>;
  let routerSpy: any;
  let translateService: any;
  let translateServiceMock: any;

  beforeEach(async () => {

    incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getIncidents']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

    incidentServiceSpy.getIncidents.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ListComponent, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [
        { provide: IncidentService, useValue: incidentServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch incidents on initialization', fakeAsync(() => {
    const mockIncidents: Incident[] = [
      { id: 1,
        canal_id: 1, 
        asunto: '', 
        canal_nombre: 1, 
        descripcion: '', 
        tipo_id: 1, 
        fecha_actualizacion: new Date(), 
        fecha_creacion: new Date(),
        persona_id: 1, 
        usuario_asignado_id: 1, 
        usuario_creador_id: 1, 
        codigo: 'INC001', 
        estado_id: 1, 
        person: { nombres: 'test', apellidos: 'test', tipo_identificacion: 'CC', id: 1, fecha_creacion: new Date(), fecha_actualizacion: new Date(), numero_identificacion: '123456' }},
        { id: 1,
          canal_id: 1, 
          asunto: '', 
          canal_nombre: 1, 
          descripcion: '', 
          tipo_id: 1, 
          fecha_actualizacion: new Date(), 
          fecha_creacion: new Date(),
          persona_id: 1, 
          usuario_asignado_id: 1, 
          usuario_creador_id: 1, 
          codigo: 'INC002', 
          estado_id: 1, 
          person: { nombres: 'test', apellidos: 'test', tipo_identificacion: 'CC', id: 1, fecha_creacion: new Date(), fecha_actualizacion: new Date(), numero_identificacion: '123456' }}
    ];
    incidentServiceSpy.getIncidents.and.returnValue(of(mockIncidents));

    component.ngAfterViewInit();
    tick();
    flush()

    expect(incidentServiceSpy.getIncidents).toHaveBeenCalled();
    expect(component.dataIncident).toBeInstanceOf(MatTableDataSource);
    expect(component.dataIncident.data).toEqual(mockIncidents);
  }));

  it('should handle error when fetching incidents', fakeAsync(() => {
    const errorResponse = new Error('Failed to load incidents');
    incidentServiceSpy.getIncidents.and.returnValue(throwError(() => errorResponse));

    component.ngAfterViewInit();
    tick();
    flush()

    expect(incidentServiceSpy.getIncidents).toHaveBeenCalled();
  }));

  it('should apply filters correctly', () => {
    component.dataIncident = new MatTableDataSource<Incident>([
      { id: 1,
        canal_id: 1, 
        asunto: '', 
        canal_nombre: 1, 
        descripcion: '', 
        tipo_id: 1, 
        fecha_actualizacion: new Date(), 
        fecha_creacion: new Date(),
        persona_id: 1, 
        usuario_asignado_id: 1, 
        usuario_creador_id: 1, 
        codigo: 'INC001', 
        estado_id: 1, 
        person: { nombres: 'test', apellidos: 'test', tipo_identificacion: 'CC', id: 1, fecha_creacion: new Date(), fecha_actualizacion: new Date(), numero_identificacion: '123456' }},
        { id: 1,
          canal_id: 1, 
          asunto: '', 
          canal_nombre: 1, 
          descripcion: '', 
          tipo_id: 1, 
          fecha_actualizacion: new Date(), 
          fecha_creacion: new Date(),
          persona_id: 1, 
          usuario_asignado_id: 1, 
          usuario_creador_id: 1, 
          codigo: 'INC002', 
          estado_id: 1, 
          person: { nombres: 'test', apellidos: 'test', tipo_identificacion: 'CC', id: 1, fecha_creacion: new Date(), fecha_actualizacion: new Date(), numero_identificacion: '123456' }}
    ]);

    component.filterCodeIncident = 'INC001';
    component.filterIdentityNumber = '123456';
    component.filterStatus = 1;

    component.applyFilters();

    const filterPredicate = component.dataIncident.filterPredicate;
    expect(filterPredicate).toBeDefined();

    const match = filterPredicate(
      { id: 1,
        canal_id: 1, 
        asunto: '', 
        canal_nombre: 1, 
        descripcion: '', 
        tipo_id: 1, 
        fecha_actualizacion: new Date(), 
        fecha_creacion: new Date(),
        persona_id: 1, 
        usuario_asignado_id: 1, 
        usuario_creador_id: 1, 
        codigo: 'INC001', 
        estado_id: 1, 
        person: { nombres: 'test', apellidos: 'test', tipo_identificacion: 'CC', id: 1, fecha_creacion: new Date(), fecha_actualizacion: new Date(), numero_identificacion: '123456' } },
      JSON.stringify({ identifier: 'inc001', identityNumber: '123456', status: 1 })
    );
    expect(match).toBeTrue();
  });

  it('should clear filters', () => {
    component.filterCodeIncident = 'INC001';
    component.filterIdentityNumber = '123456';
    component.filterStatus = 1;

    spyOn(component, 'applyFilters');

    component.clearFilters();

    expect(component.filterCodeIncident).toBe('');
    expect(component.filterIdentityNumber).toBe('');
    expect(component.filterStatus).toBe(0);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should navigate to incident detail', () => {
    const incidentId = 1;
    component.goToIncidentDetail(incidentId);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/incident/detail/', incidentId]);
  });

  it('should navigate to user query', () => {
    component.goToUserQuery();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/user-query/']);
  });

  it('should set isAgentUser based on decoded token', () => {
    storageService.getItem.and.returnValue(JSON.stringify({ user_type: 'agente' }));

    component = fixture.componentInstance;
    expect(component.isAgentUser).toBeTrue();

  });
});
