import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDialogComponent } from './incident-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../../../common/storage.service';
import { IncidentService } from '../incident.service';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IncidentDialogComponent', () => {
  let component: IncidentDialogComponent;
  let fixture: ComponentFixture<IncidentDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<IncidentDialogComponent>>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let translateService: any;
  let translateServiceMock: any;


  beforeEach(async () => {

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageServiceSpy.getItem.and.returnValue(JSON.stringify({ id_company: 1, language: 'es' }));  

    incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['getAgentsAvaiables']);
    incidentServiceSpy.getAgentsAvaiables.and.returnValue(of(
      [{ id: 1, nombre_usuario:'Agente 1', numero_identificacion:'1030661927', nombre_completo:'Agente 1' },
      { id: 2, nombre_usuario:'Agente 2', numero_identificacion:'1030661927', nombre_completo:'Agente 2' },
      ]
    ));

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
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { status: '4', assignedTo: 1 } },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: IncidentService, useValue: incidentServiceSpy },
      ],
      imports: [IncidentDialogComponent, BrowserAnimationsModule, TranslateModule.forRoot() 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct values', () => {
    console.log(component.incidentManagementForm.value)
    expect(component.incidentManagementForm.value).toEqual({
      status: '4',
      assignedTo: {id: 1, nombre_usuario: 'Agente 1', numero_identificacion: '1030661927', nombre_completo: 'Agente 1'},
      observations: ''
    });
  });

  it('should initialize filtered agents based on search term', () => {
    component.filteredAgents.subscribe((agents) => {
      expect(agents.length).toBeGreaterThanOrEqual(1);
      expect(agents[0].nombre_completo).toBe('Agente 1');
    });
  });

  it('should mark all controls as touched when saving with invalid form', () => {
    component.incidentManagementForm.controls['status'].setValue('');
    component.onSave();
    expect(component.incidentManagementForm.controls['status'].touched).toBeTrue();
    expect(component.incidentManagementForm.valid).toBeFalse();
  });

  it('should close the dialog with false when cancelling', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with form data when saving with a valid form', () => {
    component.incidentManagementForm.controls['status'].setValue('4');
    component.incidentManagementForm.controls['assignedTo'].setValue({ id: 1, nombre_completo: 'Agente 1' });
    component.incidentManagementForm.controls['observations'].setValue('Valid observation');

    component.onSave();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    const formData = dialogRefSpy.close.calls.mostRecent().args[0] as FormData;
    expect(formData.get('status')).toBe('4');
    expect(formData.get('assignedTo')).toBe('1');
    expect(formData.get('observations')).toBe('Valid observation');
  });

  it('should call `getAgentsAvaiables` and set `hasMoreThanOneAgent` based on response', () => {
    incidentServiceSpy.getAgentsAvaiables.and.returnValue(of([{ id: 1, nombre_usuario:'test', numero_identificacion:'1030661927', nombre_completo:'test' }]));
    component.inicializeFilterAgent(1);
    expect(component.hasMoreThanOneAgent).toBeFalse();
  });
});
