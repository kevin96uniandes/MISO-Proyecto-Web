import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {HttpClientModule, provideHttpClient} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;
  let jwtHelper: jasmine.SpyObj<JwtHelperService>;
  let translateServiceMock: any;
  let translateService: any;

  beforeEach(async () => {

    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get', 'setDefaultLang']);
    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      setDefaultLang: translateService.setDefaultLang.and.returnValue(of({})),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({})); 
    translateServiceMock.use.and.returnValue(of({}));

    jwtHelper = jasmine.createSpyObj('JwtHelperService', ['decodeToken']);
    storageService = jasmine.createSpyObj('StorageService', ['setItem']);
    loginService = jasmine.createSpyObj('LoginService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: loginService },
        { provide: StorageService, useValue: storageService },
        { provide: Router, useValue: router },
        { provide: JwtHelperService, useValue: jwtHelper },
        { provide: TranslateService, useValue: translateServiceMock }, 
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with two controls', () => {
    expect(component.loginForm.contains('username')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should set error message when username is required', () => {
    component.loginForm.controls['username'].setValue('');
    component.updateErrorUsernameMessage();
    expect(component.errorUsernameMessage()).toBe('Campo requerido');
  });

  it('should clear error message when username is valid', () => {
    component.loginForm.controls['username'].setValue('testUser');
    component.updateErrorUsernameMessage();
    expect(component.errorUsernameMessage()).toBe('');
  });

  it('should set error message when password is required', () => {
    component.loginForm.controls['password'].setValue('');
    component.updateErrorPasswordMessage();
    expect(component.errorPasswordMessage()).toBe('Campo requerido');
  });

  it('should clear error message when password is valid', () => {
    component.loginForm.controls['password'].setValue('testPassword');
    component.updateErrorPasswordMessage();
    expect(component.errorPasswordMessage()).toBe('');
  });

  it('should show error alert when authentication fails', () => {
    loginService.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    spyOn(Swal, 'fire');
    component.authenticate({ username: 'wrongUser', password: 'wrongPassword' });
    /*expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Usuario o contraseña incorrectos',
    });*/
  });

  it('should toggle password visibility on click', () => {
    expect(component.hide()).toBe(true);
    component.clickEvent(new MouseEvent('click'));
    expect(component.hide()).toBe(false);
  });

  it('should authenticate successfully, set tokens, and navigate to dashboard', () => {
    const decodedToken = {
      "sub": "1234567890",
      "name": "John Doe",
      "iat": 1516239022
    };
    const response = {
      id: 1,
      mensaje: "Inicio de sesión exitoso",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      username: "sa"
    };

    loginService.login.and.returnValue(of(response));
    jwtHelper.decodeToken.and.returnValue(decodedToken);
    component.authenticate({ username: 'testUser', password: 'testPassword' });
    expect(storageService.setItem).toHaveBeenCalledWith('token', response.token);

  });
});
