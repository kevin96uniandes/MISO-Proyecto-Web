import { TestBed } from '@angular/core/testing';

import { InvoiceService } from './invoice.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { Invoice } from './invoice';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  const invoiceUrl: string = environment.invoiceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule],
      providers: [
        InvoiceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL with POST method and return an Invoice', () => {
    const mockInvoice: Invoice = {
      "empresa_id": 12345,
      "estado_factura": "Pagada",
      "fecha_actualizacion": "2024-11-01T15:30:00Z",
      "fecha_creacion": "2024-10-20T09:00:00Z",
      "fecha_pago": "2024-11-10T10:00:00Z",
      "id": 1,
      "incidencia_correo_precio_total": 250.75,
      "numero_incidencia_correo": 10,
      "incidencia_llamadas_precio_total": 300.50,
      "numero_incidencia_llamadas": 15,
      "incidencia_movil_precio_total": 150.25,
      "numero_incidencia_movil": 5,
      "plan_precio_total": 1000.00,
      "referencia_pago": "REF20241110ABC123",
      "valor_pagar": 1701.50
    }
    const month = '2023-01';
    const empresaId = '12345';

    service.getInvoice(month, empresaId, 'es').subscribe((response) => {
      expect(response).toEqual(mockInvoice);
    });
  });

  it('should call the correct URL with GET method and return a Blob', () => {
    const invoiceId = 101;
    const lang = 'en';
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });

    service.getInvoicePdfFile(invoiceId, lang).subscribe((response) => {
      expect(response).toEqual(mockBlob);
    });

  });

  it('should call the correct URL with POST method to send an email', () => {
    const mockRequest = { email: 'test@example.com', invoiceId: 101 };
    const mockResponse = { success: true };

    service.sendInvoicePdfFile(mockRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should call the correct URL with POST method to pay an invoice', () => {
    const idInvoice = '12345';
    const paymentMethodId = 1;
    const mockRequest = { id_invoice: idInvoice, payment_method_id: paymentMethodId };
    const mockResponse = { success: true };

    service.payInvoice(idInvoice, paymentMethodId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

  });
});
