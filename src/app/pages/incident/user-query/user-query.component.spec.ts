import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQueryComponent } from './user-query.component';
import { IncidentService } from '../incident.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Person } from '../../auth/person';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

describe('UserQueryComponent', () => {
  let component: UserQueryComponent;
  let fixture: ComponentFixture<UserQueryComponent>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let translateService: any;
  let translateServiceMock: any;


  beforeEach(async () => {

    const incidentServiceMock = jasmine.createSpyObj('IncidentService', ['getPersonByIdentity']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

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
      imports: [UserQueryComponent,  ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: IncidentService, useValue: incidentServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TranslateService, useValue: translateServiceMock }  
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQueryComponent);
    component = fixture.componentInstance;
    incidentServiceSpy = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    component.userQueryForm = formBuilder.group({
      identityType: ['1'], 
      identityNumber: ['12345678']
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.userQueryForm).toBeDefined();
    expect(component.userQueryForm.get('identityType')).toBeTruthy();
    expect(component.userQueryForm.get('identityNumber')).toBeTruthy();
  });

  it('should navigate to /dashboard/incident if person is not found', () => {
    component.userQueryForm = formBuilder.group({
      identityType: ['1'], 
      identityNumber: ['12345678']
    });
    
    fixture.detectChanges();
    incidentServiceSpy.getPersonByIdentity.and.returnValue(of({} as Person));

    component.userQuery();

    expect(incidentServiceSpy.getPersonByIdentity).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/incident']);
  });

  it('should navigate to /dashboard/ranking with person data if person is found', () => {
    component.userQueryForm = formBuilder.group({
      identityType: ['1'], 
      identityNumber: ['12345678']
    });
    
    fixture.detectChanges();
    
    const mockPerson: Person = { 
      id: 1, 
      nombres: 'John',
      apellidos: 'Doe',
      tipo_identificacion: 'CC',
      numero_identificacion: '12345678',
      telefono: '3204456789',
      correo_electronico: 'john.doe@example.com', 
      fecha_creacion: new Date('2023-01-01'),
      fecha_actualizacion: new Date('2024-01-01') 
  };
  
    incidentServiceSpy.getPersonByIdentity.and.returnValue(of(mockPerson));

    component.userQuery();

    expect(incidentServiceSpy.getPersonByIdentity).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/ranking'], { state: { person: mockPerson } });
  });

  it('should show an error message if the service call fails', () => {
    spyOn(Swal, 'fire');
    component.userQueryForm = formBuilder.group({
      identityType: ['1'], 
      identityNumber: ['12345678']
    });
    
    fixture.detectChanges();
    incidentServiceSpy.getPersonByIdentity.and.returnValue(throwError(() => new Error('Service error')));

    component.userQuery();

    expect(incidentServiceSpy.getPersonByIdentity).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Se ha presentado un error a la hora de consultar el ranking del usuario',
    }));
  });
  it('should mark all controls as touched and update validity if form is invalid', () => {
    // Configuramos el formulario como inválido
    component.userQueryForm.controls['identityType'].setValue('');
    component.userQueryForm.controls['identityNumber'].setValue('');

    component.userQuery();

    expect(incidentServiceSpy.getPersonByIdentity).not.toHaveBeenCalled();
  });
});
