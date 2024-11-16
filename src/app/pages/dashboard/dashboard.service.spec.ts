import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {Login} from "../auth/login/login";
import {environment} from "../../../environments/environment";
import {ResponseChat} from "./ResponseChat";

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully', () => {
    const request = JSON.stringify({ context: 'context' });
    const mockResponse: ResponseChat = { type: 'Type', context: 'Context' }

    service.predict(request).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ia/sync`); // Espera la solicitud HTTP
    expect(req.request.method).toBe('POST'); // Verifica que la solicitud sea un POST
    req.flush(mockResponse); // Simula la respuesta del servidor
  });
});
