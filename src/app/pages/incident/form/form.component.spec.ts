import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IncidentService } from '../incident.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';


import { faker } from '@faker-js/faker';
import { StorageService } from '../../../common/storage.service';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('FormComponent', () => {

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockIncidentService: jasmine.SpyObj<IncidentService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockRouter: jasmine.SpyObj<Router>;


  beforeEach(async () => {

    mockIncidentService = jasmine.createSpyObj('IncidentService', ['createIncident']);
    const mockStorageService = {
      getItem: jasmine.createSpy('getItem').and.returnValue(JSON.stringify({ id: faker.datatype.uuid() }))
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']); 

    await TestBed.configureTestingModule({
      imports: [FormComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Location,
          useValue: { back: jasmine.createSpy('back') }, 
        }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a defined form', () => {
    expect(component.incidentForm).toBeTruthy();
  });
  it('should have fields in the form', () => {
    const form = component.incidentForm;
    expect(form.get('name')).toBeDefined();
    expect(form.get('lastName')).toBeDefined();
    expect(form.get('identityType')).toBeDefined();
    expect(form.get('identityNumber')).toBeDefined();
    expect(form.get('cellPhone')).toBeDefined();
    expect(form.get('incidentType')).toBeDefined(); 
    expect(form.get('incidentChannel')).toBeDefined();
    expect(form.get('incidentSubject')).toBeDefined(); 
    expect(form.get('incidentDetail')).toBeDefined();  
  });
  it('you should mark the name field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the name field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('name');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the name field as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('name');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('you should mark the lastName field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('lastName');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the lastName field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('lastName');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the lastName field as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('lastName');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('you should mark the identityType field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('identityType');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the email field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the email field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the email field as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('should mark the email field as invalid if the email does not have valid formatting', () => {
    let invalidEmail = faker.lorem.word();

    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(invalidEmail);
    expect(nameControl?.hasError('pattern')).toBeTrue();
  })
  it('you should mark the identity number field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('identityNumber');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the identity number field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('identityNumber');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the identity number as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('should mark the identity number field as invalid if the identity number does not have valid formatting', () => {
    let invalidEmail = faker.lorem.word();

    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(invalidEmail);
    expect(nameControl?.hasError('pattern')).toBeTrue();
  })
  it('you should mark the cellphone field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('cellPhone');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the cellphone field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('cellPhone');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the cellphone as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('cellPhone');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('should mark the cellphone field as invalid if the identity number does not have valid formatting', () => {
    let invalidEmail = faker.lorem.word();

    const nameControl = component.incidentForm.get('cellPhone');
    nameControl?.setValue(invalidEmail);
    expect(nameControl?.hasError('pattern')).toBeTrue();
  })
  it('you should mark the incident fype field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('incidentType');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the incident channel field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('incidentChannel');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('should mark the identity number field as invalid if the identity number does not have valid formatting', () => {
    let invalidEmail = faker.lorem.word();

    const nameControl = component.incidentForm.get('emailClient');
    nameControl?.setValue(invalidEmail);
    expect(nameControl?.hasError('pattern')).toBeTrue();
  })
  it('you should mark the incident subject field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('incidentSubject');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the incident subject field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('incidentSubject');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the incident subject as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(20);

    const nameControl = component.incidentForm.get('incidentSubject');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('you should mark the incident detail field as invalid if it is empty.', () => {
    const nameControl = component.incidentForm.get('incidentDetail');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  })
  it('you should mark the incident detail field as invalid if the size is less than 2 characters.', () => {
    const singleCharacter = faker.string.alphanumeric(1);
    
    const nameControl = component.incidentForm.get('incidentDetail');
    nameControl?.setValue(singleCharacter);
    expect(nameControl?.hasError('minlength')).toBeTrue();
  })
  it('you should mark the incident detail as invalid if the size is greater than 100 characters', () => {
    const longSentence = faker.lorem.sentence(50);

    const nameControl = component.incidentForm.get('incidentDetail');
    nameControl?.setValue(longSentence);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  })
  it('should update attachedFiles when onFilesChanged is called', () => {
    const mockFiles = [
      new File(['content'], 'test-file1.txt'),
      new File(['content'], 'test-file2.txt'),
    ];

    component.onFilesChanged(mockFiles);

    expect(component.attachedFiles).toEqual(mockFiles);
  })
  it('should call location.back when goBack is called', () => {
    const location = TestBed.inject(Location);
  
    component.goBack();
  
    expect(location.back).toHaveBeenCalled();
  });
  it('should call createIncident and display success message on successful creation', () => {
    const mockResponse = { codigo: 'INC1234' };
    mockIncidentService.createIncident.and.returnValue(of(mockResponse));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true 
    }));

    component.incidentForm.get('name')?.setValue('Jhon')
    component.incidentForm.get('lastName')?.setValue('Doe')
    component.incidentForm.get('identityType')?.setValue('CC')
    component.incidentForm.get('emailClient')?.setValue('j.doe@outlook.com')
    component.incidentForm.get('identityNumber')?.setValue('123456789')
    component.incidentForm.get('cellPhone')?.setValue('123456789')
    component.incidentForm.get('incidentType')?.setValue('petición')
    component.incidentForm.get('incidentChannel')?.setValue('llamada')
    component.incidentForm.get('incidentSubject')?.setValue('titulo de prubea')
    component.incidentForm.get('incidentDetail')?.setValue('detalle de prubea')

    component.createIncident();

    expect(mockIncidentService.createIncident).toHaveBeenCalled();
     expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: `Se ha creado la incidencia ${mockResponse['codigo']} con exito`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#82BDAE',
    }));
  })

it('should call createIncident and display error message on failure', () => {
  const mockError = { message: 'Error creating incident' };
  mockIncidentService.createIncident.and.returnValue(throwError(() => mockError));

  spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
    isConfirmed: true,
    isDenied: false,
    isDismissed: false,
    value: true 
  }));

  component.incidentForm.get('name')?.setValue('Jhon')
  component.incidentForm.get('lastName')?.setValue('Doe')
  component.incidentForm.get('identityType')?.setValue('CC')
  component.incidentForm.get('emailClient')?.setValue('j.doe@outlook.com')
  component.incidentForm.get('identityNumber')?.setValue('123456789')
  component.incidentForm.get('cellPhone')?.setValue('123456789')
  component.incidentForm.get('incidentType')?.setValue('petición')
  component.incidentForm.get('incidentChannel')?.setValue('llamada')
  component.incidentForm.get('incidentSubject')?.setValue('titulo de prubea')
  component.incidentForm.get('incidentDetail')?.setValue('detalle de prubea')

  component.createIncident();

  expect(mockIncidentService.createIncident).toHaveBeenCalled();
  expect(component.isLoading).toBeFalse();
  expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
    icon: 'error',
    title: 'Se ha presentado un error a la hora de crear la incidencia',
  }));
});
});
