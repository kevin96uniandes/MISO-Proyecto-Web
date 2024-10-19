import { TestBed } from '@angular/core/testing';
import { ListService } from './list.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Agente } from './list-agents/list-agents.component';
import { provideHttpClient } from '@angular/common/http';

describe('ListService', () => {
  let service: ListService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl + '/user/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ListService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch agents by company ID', () => {
    const mockAgents: Agente[] = [
      {
        nombre_usuario: 'user1',
        numero_identificacion: '123',
        nombre_completo: 'User One',
        telefono: '123456789',
        correo_electronico: 'user1@example.com',
      },
      {
        nombre_usuario: 'user2',
        numero_identificacion: '456',
        nombre_completo: 'User Two',
        telefono: '987654321',
        correo_electronico: 'user2@example.com',
      }
    ];

    const companyId = 1;

    service.getAgentsByIdCompany(companyId).subscribe(agents => {
      expect(agents.length).toBe(2);
      expect(agents).toEqual(mockAgents);
    });

    const req = httpTestingController.expectOne(`${apiUrl}agent/${companyId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAgents); // Simula la respuesta del servidor con los datos de agentes
  });
});
