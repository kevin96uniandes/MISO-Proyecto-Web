import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service'; // Asegúrate de importar correctamente
import { StorageService } from './storage.service';
import { AuthService } from '../pages/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('TokenService', () => {
  let service: TokenService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'clear']);
    const authSpy = jasmine.createSpyObj('AuthService', ['validateToken']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(TokenService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Instala el reloj de Jasmine
    jasmine.clock().install();
  });

  afterEach(() => {
    // Desinstala el reloj de Jasmine
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to login if token is absent', () => {
    storageServiceSpy.getItem.and.returnValue(null); // Simula que no hay token

    service.startTokenValidationCheck();

    jasmine.clock().tick(6001); // Mueve el reloj para que pase el intervalo

    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should validate token if present', () => {
    const mockToken = 'mockToken';
    storageServiceSpy.getItem.and.returnValue(mockToken); // Simula que hay un token
    authServiceSpy.validateToken.and.returnValue(of({})); // Simula una respuesta exitosa

    service.startTokenValidationCheck();

    jasmine.clock().tick(6001); // Mueve el reloj para que pase el intervalo

    expect(authServiceSpy.validateToken).toHaveBeenCalledWith(mockToken);
  });

  it('should clear storage and navigate to login if token is invalid', () => {
    const mockToken = 'mockToken';
    storageServiceSpy.getItem.and.returnValue(mockToken); // Simula que hay un token
    authServiceSpy.validateToken.and.returnValue(throwError('Invalid Token')); // Simula un error en la validación

    service.startTokenValidationCheck();

    jasmine.clock().tick(6001); // Mueve el reloj para que pase el intervalo

    expect(storageServiceSpy.clear).toHaveBeenCalled(); // Verifica que se haya limpiado el almacenamiento
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']); // Verifica que navegue a login
  });
});
