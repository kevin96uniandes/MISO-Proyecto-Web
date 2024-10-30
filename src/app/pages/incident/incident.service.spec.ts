import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';
import { environment } from '../../../environments/environment';
import { Person } from '../auth/person';
import { Incident } from './interfaces/incident';
import { Call } from '../call/calls';
import { Product } from './interfaces/product';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  
  const incidentUrl = environment.incidentUrl;
  const personUrl = environment.apiUrl + '/user/person';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule],
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an incident', () => {
    const mockFormData = new FormData();
    const mockResponse = { success: true };

    service.createIncident(mockFormData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${incidentUrl}create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get incidents by person ID', () => {
    const personId = 1;
    const mockIncidents: Incident[] = [
      { id: 1, codigo: 'INC001', descripcion: 'Descripción 1', asunto: 'Asunto 1', fecha_creacion: new Date(), fecha_actualizacion: new Date(), canal_id: 1, usuario_creador_id: 1, usuario_asignado_id: 1, persona_id: 1, estado_id: 1, tipo_id: 1 }
    ];

    service.getIncidentByIdPerson(personId).subscribe(incidents => {
      expect(incidents).toEqual(mockIncidents);
    });

    const req = httpMock.expectOne(`${incidentUrl}person/${personId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidents);
  });

  it('should get calls by person ID', () => {
    const personId = 1;
    const mockCalls: Call[] = [
      { id: 1, nombre_grabacion: 'Call001', duracion: '10:00', fecha_hora_llamada: new Date(), fecha_creacion: new Date(), fecha_actualizacion: new Date(), incidencia_id: 1, persona_id: 1, usuario_id: 1 }
    ];

    service.getCallsByIdPerson(personId).subscribe(calls => {
      expect(calls).toEqual(mockCalls);
    });

    const req = httpMock.expectOne(`${incidentUrl}calls/${personId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCalls);
  });

  it('should get person by identity type and number', () => {
    const identityType = 'ID';
    const identityNumber = '123456';
    const mockPerson: Person = {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      tipo_identificacion: 'Cédula de Ciudadanía',
      numero_identificacion: '123456789',
      telefono: '3216549870',  
      correo_electronico: 'juan.perez@example.com', 
      fecha_creacion: new Date('2024-01-01T12:00:00'),  
      fecha_actualizacion: new Date('2024-01-15T12:00:00')  
    };
    
    service.getPersonByIdentity(identityType, identityNumber).subscribe(person => {
      expect(person).toEqual(mockPerson);
    });

    const req = httpMock.expectOne(req =>
      req.url === `${personUrl}` &&
      req.params.has('identityType') && req.params.get('identityType') === identityType &&
      req.params.has('identityNumber') && req.params.get('identityNumber') === identityNumber
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  });

  it('should get products by person ID', () => {
    const personId = 1;
    const mockProducts: Product[] = [
      { id: 1, nombre_producto: 'Producto1', descripcion: 'Descripción Producto 1', fecha_creacion: '2023-10-01', fecha_actualizacion: '2023-10-02', tipo: 'Electrónica' }
    ];

    service.getProductsByPerson(personId).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${personUrl}/${personId}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
