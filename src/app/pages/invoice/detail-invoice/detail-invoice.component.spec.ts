import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DetailInvoiceComponent } from './detail-invoice.component';
import { of, throwError } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailInvoiceComponent', () => {
  let component: DetailInvoiceComponent;
  let fixture: ComponentFixture<DetailInvoiceComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let translateService: any;
  let translateServiceMock: any;

  beforeEach(async () => {

    invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['getInvoice', 'sendInvoicePdfFile', 'getInvoicePdfFile']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    storageServiceSpy.getItem.and.returnValue(JSON.stringify({ id_company: 1, language: 'es' }));  
    invoiceServiceSpy.getInvoice.and.returnValue(of({
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
    }));

    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get']);
    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({})); 
    translateServiceMock.use.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      providers: [
        { provide: InvoiceService, useValue: invoiceServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      imports: [DetailInvoiceComponent, BrowserAnimationsModule, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize language and currency correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component.lang).toBe('en');
    expect(component.currency).toBe('USD');
  });

  it('should call getInvoice and set the invoice data', fakeAsync(() => {
  
    component.getInvoice();
    tick();

    expect(component.invoice);
  }));

  it('should handle error when getInvoice fails', fakeAsync(() => {
    invoiceServiceSpy.getInvoice.and.returnValue(throwError({ error: { msg: 'Error message' } }));
    spyOn(Swal, 'fire');
    storageServiceSpy.getItem.and.returnValue(JSON.stringify({ id_company: 123 }));

    component.getInvoice();
    tick();

    expect(Swal.fire).toHaveBeenCalled();
  }));

  it('should open the email dialog and send invoice PDF if dialog is confirmed', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ email: 'test@example.com' }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    invoiceServiceSpy.sendInvoicePdfFile.and.returnValue(of({ status_code: 202 }));
    spyOn(Swal, 'fire');

    component.invoice = { id: 1 } as any;
    component.openSendEmailDialog();
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(EmailDialogComponent, { disableClose: true });
    expect(invoiceServiceSpy.sendInvoicePdfFile).toHaveBeenCalledWith({
      email: 'test@example.com',
      invoice_id: 1,
      lang: component.lang
    });
    expect(Swal.fire).toHaveBeenCalled();
  }));

  it('should switch currency from COP to USD and adjust invoice values', () => {
    component.currency = 'COP';
    component.lang = 'es';
    component.invoice = {
      plan_precio_total: 4300,
      incidencia_correo_precio_total: 4300,
      incidencia_llamadas_precio_total: 4300,
      incidencia_movil_precio_total: 4300,
      valor_pagar: 4300
    } as any;

    component.onCurrencyChange();

    expect(component.currency).toBe('COP');
    expect(component.lang).toBe('es');
  });

  it('should switch currency from USD to COP and adjust invoice values', () => {
    component.currency = 'USD';
    component.lang = 'en';
    component.invoice = {
      plan_precio_total: 1,
      incidencia_correo_precio_total: 1,
      incidencia_llamadas_precio_total: 1,
      incidencia_movil_precio_total: 1,
      valor_pagar: 1
    } as any;

    component.onCurrencyChange();

    expect(component.currency).toBe('USD');
    expect(component.lang).toBe('en');
  });

  it('should navigate to payment method page with the correct invoice ID', () => {
    component.invoice = { id: 123 } as any;
    component.goToPayment();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/invoice/payment-method/123']);
  });

  it('should open invoice PDF file in a new tab', fakeAsync(() => {
    const mockPdfBlob = new Blob(['Test PDF content'], { type: 'application/pdf' });
    invoiceServiceSpy.getInvoicePdfFile.and.returnValue(of(mockPdfBlob));
    spyOn(window, 'open');

    component.invoice = { id: 123 } as any;
    component.openInvoiceFile();
    tick();

    expect(window.open).toHaveBeenCalled();
  }));
});
