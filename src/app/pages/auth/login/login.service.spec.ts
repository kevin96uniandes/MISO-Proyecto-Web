import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { Login } from './login';
import { environment } from '../../../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importar el módulo de pruebas HTTP
      providers: [LoginService] // Proveer el servicio
    });

    service = TestBed.inject(LoginService); // Inyectar el servicio
    httpMock = TestBed.inject(HttpTestingController); // Inyectar el controlador de pruebas HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio se haya creado
  });

  it('should login successfully', () => {
    const login: Login = { username: 'testUser', password: 'testPassword' }; // Crear un objeto de login
    const mockResponse = { token: 'fake-jwt-token' }; // Simular una respuesta del servidor

    service.login(login).subscribe(response => {
      expect(response).toEqual(mockResponse); // Verifica que la respuesta sea la esperada
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user/auth/login`); // Espera la solicitud HTTP
    expect(req.request.method).toBe('POST'); // Verifica que la solicitud sea un POST
    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('should handle login error', () => {
    const login: Login = { username: 'testUser', password: 'testPassword' }; // Crear un objeto de login
    const mockErrorResponse = { error: 'Invalid credentials' }; // Simular un error

    service.login(login).subscribe(
      () => fail('Expected an error, not a successful response'), // Fallar si se recibe una respuesta exitosa
      error => {
        expect(error.error).toEqual({ error: 'Invalid credentials' }); // Verifica que el error sea el esperado
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/user/auth/login`); // Espera la solicitud HTTP
    expect(req.request.method).toBe('POST'); // Verifica que la solicitud sea un POST
    req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' }); // Simula la respuesta de error
  });
});
