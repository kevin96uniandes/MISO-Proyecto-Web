import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {BoardService} from "./board.service";
import {Login} from "../auth/login/login";
import {Boardpercentage} from "./interfaces/boardpercentage";
import {BoardResponse} from "./interfaces/BoardResponse";
import {Boardfilter} from "./interfaces/boardfilter";
import {Incidentsummary} from "./interfaces/boardsummary";

describe('LoginService', () => {
  let httpMock: HttpTestingController;
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService] // Proveer el servicio
    });

    service = TestBed.inject(BoardService); // Inyectar el servicio
    httpMock = TestBed.inject(HttpTestingController); // Inyectar el controlador de pruebas HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio se haya creado
  });

  it('should fetch incident percentage with correct filters', () => {
    const mockFilters: Boardfilter = { fecha_inicio: '2024-01-01', fecha_fin: '2024-01-31', canal_id: 1, estado_id: 1 }; // Ajusta los campos según tu modelo
    const mockResponse: BoardResponse = { channels: [{channel: "channel", value: 75}] }; // Respuesta esperada

    // Llama al método
    service.getIncidentPercentage(mockFilters).subscribe((response) => {
      // Verifica que la respuesta sea la esperada
      expect(response).toEqual(mockResponse);
    });

    // Ajusta la URL esperada para que coincida con la solicitud real
    const req = httpMock.expectOne(`${environment.incidentUrl}channels/percentage?fecha_inicio=2024-01-01&fecha_fin=2024-01-31&canal_id=1&estado_id=1`);
    expect(req.request.method).toBe('GET');

    // Envía una respuesta simulada
    req.flush(mockResponse);
  });


  it('should get incident summary', () => {
    const mockFilters: Boardfilter = { fecha_inicio: '2024-01-01', fecha_fin: '2024-01-31', canal_id: 1, estado_id: 1 }; // Ajusta los campos según tu modelo
    const mockResponse: Incidentsummary = { incidentes: [], total: 0 }; // Respuesta esperada

    // Llama al método
    service.getIncidentSummary(mockFilters).subscribe((response) => {
      // Verifica que la respuesta sea la esperada
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.incidentUrl}summary?fecha_inicio=2024-01-01&fecha_fin=2024-01-31&canal_id=1&estado_id=1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
