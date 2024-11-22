import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterAgentComponent } from './register-agent.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterService } from '../register.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

class MockRegisterService {
  registerClient() {
    return of({});
  }
  registerAgent() {
    return of({});
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegisterAgentComponent', () => {
  let component: RegisterAgentComponent;
  let fixture: ComponentFixture<RegisterAgentComponent>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let registerService: RegisterService;
  let router: Router;
  let translateService: any;
  let translateServiceMock: any;

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem']);
    mockStorageService.getItem.and.returnValue(JSON.stringify({ id_company: 2}));

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
        RegisterAgentComponent,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: RegisterService, useClass: MockRegisterService },
        { provide: Router, useClass: MockRouter },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: StorageService, useValue: mockStorageService },

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAgentComponent);
    component = fixture.componentInstance;
    registerService = TestBed.inject(RegisterService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registerForm with empty values', () => {
    const registerForm = component.registerForm;
    expect(registerForm).toBeDefined();
    expect(registerForm.get('nombres')?.value).toEqual('');
    expect(registerForm.get('correo_electronico')?.value).toEqual('');
    expect(registerForm.get('tipo_identificacion')?.value).toEqual('');
  });

  it('should make the registerForm invalid when fields are empty', () => {
    component.registerForm.patchValue({
      nombres: '',
      apellidos: '',
      correo_electronico: '',
      tipo_identificacion: '',
      numero_identificacion: '',
      telefono: '',
      usuario: '',
      contrasena: '',
      confirmar_contrasena: '',
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should make the registerForm valid when all fields are correctly filled', () => {
    component.registerForm.patchValue({
      nombres: 'tests',
      apellidos: 'users',
      correo_electronico: 'test@example.com',
      tipo_identificacion: '1',
      numero_identificacion: '12345678',
      telefono: '1234567890',
      usuario: 'testuser',
      contrasena: 'Password1',
      confirmar_contrasena: 'Password1',
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should show an error when passwords do not match', () => {
    component.registerForm.patchValue({
      contrasena: 'Password1',
      confirmar_contrasena: 'Password2',
    });
    component.passwordMatchValidator(component.registerForm);
    const confirmPasswordControl = component.registerForm.get('confirmar_contrasena');
    expect(confirmPasswordControl?.hasError('mismatch')).toBeTrue();
  });

  it('should call registerAgent on RegisterService when form is valid', () => {
    spyOn(registerService, 'registerAgent').and.callThrough();
    component.registerForm.patchValue({
      nombres: 'Test User',
      apellidos: 'Users',
      correo_electronico: 'test@example.com',
      tipo_identificacion: '1',
      numero_identificacion: '12345678',
      telefono: '1234567890',
      usuario: 'testuser',
      contrasena: 'Password1',
      confirmar_contrasena: 'Password1',
    });
    component.onSubmit();
    expect(registerService.registerAgent).toHaveBeenCalled();
  });

  it('should navigate to /login on successful registration', () => {
    component.registerForm.patchValue({
      nombres: 'Test User',
      apellidos: 'Users',
      correo_electronico: 'test@example.com',
      tipo_identificacion: '1',
      numero_identificacion: '12345678',
      telefono: '1234567890',
      usuario: 'testuser',
      contrasena: 'Password1',
      confirmar_contrasena: 'Password1',
    });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/list/agents']);
  });

  it('should show an error message on registration failure', () => {
    spyOn(registerService, 'registerAgent').and.returnValue(throwError({ error: 'Error' }));
    spyOn(component, 'updateErrorRequiredMessage');
    component.registerForm.patchValue({
      nombres: 'Test User',
      apellidos: 'Users',
      correo_electronico: 'test@example.com',
      tipo_identificacion: '1',
      numero_identificacion: '12345678',
      telefono: '1234567890',
      usuario: 'testuser',
      contrasena: 'Password1',
      confirmar_contrasena: 'Password1',
    });
    component.onSubmit();
    expect(component.updateErrorRequiredMessage).not.toHaveBeenCalled();
  });

  it('should set REQUIRED_FILE error message for required field', () => {
    const mockFieldName = 'telefono';
    translateServiceMock.get.and.returnValue(of({ REQUIRED_FILE: 'This field is required' }));

    // Simula el error en el control
    component.registerForm.get(mockFieldName)?.setErrors({ required: true });

    // Ejecuta la función
    component.updateErrorRequiredMessage(mockFieldName);

    // Verifica que el mensaje se haya establecido
    expect(component.errorRequiredMessage.get(mockFieldName)).toBe('This field is required');
  });

  it('should set REQUIRED_PHONE_FORMAT error message for invalid phone pattern', () => {
    const mockFieldName = 'telefono';
    translateServiceMock.get.and.returnValue(of({ REQUIRED_PHONE_FORMAT: 'Invalid phone format' }));

    // Simula el error en el control
    component.registerForm.get(mockFieldName)?.setErrors({ pattern: true });

    // Ejecuta la función
    component.updateErrorRequiredMessage(mockFieldName);

    // Verifica que el mensaje se haya establecido
    expect(component.errorRequiredMessage.get(mockFieldName)).toBe('Invalid phone format');
  });

  it('should set REQUIRED_PASSWORD_MISMATCH error message for mismatched passwords', () => {
    const mockFieldName = 'confirmar_contrasena';
    translateServiceMock.get.and.returnValue(of({ REQUIRED_PASSWORD_MISMATCH: 'Passwords do not match' }));

    // Simula el error en el control
    component.registerForm.get(mockFieldName)?.setErrors({ mismatch: true });

    // Ejecuta la función
    component.updateErrorRequiredMessage(mockFieldName);

    // Verifica que el mensaje se haya establecido
    expect(component.errorRequiredMessage.get(mockFieldName)).toBe('Passwords do not match');
  });

  it('should set REQUIRED_PASSWORD_FORMAT error message for invalid password format', () => {
    const mockFieldName = 'contrasena';
    translateServiceMock.get.and.returnValue(of({ REQUIRED_PASSWORD_FORMAT: 'Invalid password format' }));

    // Simula el error en el control
    component.registerForm.get(mockFieldName)?.setErrors({ pattern: true });

    // Ejecuta la función
    component.updateErrorRequiredMessage(mockFieldName);

    // Verifica que el mensaje se haya establecido
    expect(component.errorRequiredMessage.get(mockFieldName)).toBe('Invalid password format');
  });

  it('should clear the error message if there is no error', () => {
    const mockFieldName = 'telefono';

    // Asegura que no hay errores
    component.registerForm.get(mockFieldName)?.setErrors(null);

    // Ejecuta la función
    component.updateErrorRequiredMessage(mockFieldName);

    // Verifica que no haya mensaje de error
    expect(component.errorRequiredMessage.get(mockFieldName)).toBe('');
  });

  it('should toggle hide signal and stop event propagation', () => {
    const mockEvent = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);

    // Verifica el valor inicial de la señal
    expect(component.hide()).toBeTrue();

    // Ejecuta el método
    component.clickEvent(mockEvent);

    // Verifica que la señal haya cambiado
    expect(component.hide()).toBeFalse();

    // Verifica que `stopPropagation` se haya llamado
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
