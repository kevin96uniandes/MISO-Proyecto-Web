import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';
import { environment } from '../../../environments/environment';
import { RegisterClient } from './register-client/register-client';
import { RegisterAgent } from './register-agent/register-agent';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });
    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a client', () => {
    const mockRegisterClient: RegisterClient = {
      nombre_empresa: 'John Doe',
      email: 'john.doe@example.com',
      tipo_identificacion: 1,
      numero_identificacion: 123456789,
      sector: 'IT',
      telefono: 1234567890,
      pais: 'Country',
      usuario: 'johndoe',
      contrasena: 'Password123',
      confirmar_contrasena: 'Password123'
    };

    service.registerClient(mockRegisterClient).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user/register/client`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      nombre_empresa: 'John Doe',
      email: 'john.doe@example.com',
      tipo_identificacion: 1,
      numero_identificacion: 123456789,
      sector: 'IT',
      telefono: 1234567890,
      pais: 'Country',
      usuario: 'johndoe',
      contrasena: 'Password123',
      confirmar_contrasena: 'Password123'
    });

    req.flush({ success: true });
  });
});
