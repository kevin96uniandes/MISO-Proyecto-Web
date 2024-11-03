import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CallrecorddetailsComponent } from './callrecorddetails.component';
import { StorageService } from '../../../common/storage.service';
import { IncidentService } from '../incident.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Call } from '../../call/calls';

describe('CallrecorddetailsComponent', () => {
  let component: CallrecorddetailsComponent;
  let fixture: ComponentFixture<CallrecorddetailsComponent>;
  let storageServiceMock: jasmine.SpyObj<StorageService>;
  let incidentServiceMock: jasmine.SpyObj<IncidentService>;
  let locationMock: jasmine.SpyObj<Location>;
  let translateService: any;
  let translateServiceMock: any;

  beforeEach(async () => {
    // Create mocks for the services
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem']);
    incidentServiceMock = jasmine.createSpyObj('IncidentService', ['someMethod']); // Add a mock method if there are methods
    locationMock = jasmine.createSpyObj('Location', ['back']);


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
      imports: [
        ReactiveFormsModule,
        CallrecorddetailsComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: IncidentService, useValue: incidentServiceMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Location, useValue: locationMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallrecorddetailsComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    // Initialize default values
    storageServiceMock.getItem.and.returnValue('es'); // Set default language
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the audio source correctly when selectedCall is available', () => {
    const mockCall: Call = {
        id: 1,
        nombre_grabacion: 'test-audio.mp3',
        duracion: '00:02:30',
        fecha_hora_llamada: new Date(),
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        incidencia_id: 123,
        persona_id: 456,
        usuario_id: 789
      };

    component.selectedCall = mockCall

    component.ngOnInit();

    expect(component.callForm.value.nombre_grabacion).toBe(mockCall.nombre_grabacion);
    expect(component.callForm.value.duracion).toBe(mockCall.duracion);
    expect(component.callForm.value.fecha_hora_llamada).toEqual(mockCall.fecha_hora_llamada);
    expect(component.audioSource).toBe('https://storage.googleapis.com/abcall-bucket/incident-calls/test-audio.mp3');
  });

  it('should go back to the previous location', () => {
    component.goBack();
    expect(locationMock.back).toHaveBeenCalled();
  });
});
