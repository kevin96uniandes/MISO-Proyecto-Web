import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { User } from '../auth/user';
import { ProfileService } from './profile.service';
import { Incident } from '../incident/interfaces/incident';

describe('ListService', () => {
  let service: ProfileService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;
  const incidentUrl = environment.incidentUrl

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch agents all incidences', () => {
    const mockIncidences: Incident[] = [
      {
        id: 123,
        codigo: "INC-00123",
        descripcion: "Error in the system causing downtime.",
        asunto: "System Outage",
        fecha_creacion: new Date("2024-11-01T10:00:00Z"),
        fecha_actualizacion: new Date("2024-11-02T12:00:00Z"),
        canal_id: 2,
        canal_nombre: 1,
        usuario_creador_id: 1,
        usuario_asignado_id: 1,
        persona_id: 11,
        estado_id: 1,
        tipo_id: 1
      },
      {
        id: 124,
        codigo: "INC-00124",
        descripcion: "Error in the system causing downtime.",
        asunto: "System Outage",
        fecha_creacion: new Date("2024-11-01T10:00:00Z"),
        fecha_actualizacion: new Date("2024-11-02T12:00:00Z"),
        canal_id: 2,
        canal_nombre: 3,
        usuario_creador_id: 1,
        usuario_asignado_id: 1,
        persona_id: 1,
        estado_id: 1,
        tipo_id: 1
      }
    ];

    service.getIncidences().subscribe(incidents => {
      console.log(incidents)
      expect(incidents.length).toBe(2);
      expect(incidents).toEqual(mockIncidences);
    });

    const req = httpTestingController.expectOne(`${incidentUrl}all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidences);
  });


  it('should fetch an user', () => {
    const mockUser: User = {
      id: 1,
      id_persona: 1,
      id_empresa: 1,
      id_tipousuario: 1,
      nombre_usuario: 'jdoe',
      contrasena: 'securePassword123',
      fecha_creacion: new Date('2024-01-01T00:00:00'),
      fecha_actualizacion: new Date('2024-11-16T12:00:00'),
      es_activo: true
    };

  
    const userId = 1;

    service.getUser(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    
    const req = httpTestingController.expectOne(`${apiUrl}/user/get/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
