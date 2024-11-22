import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodComponent } from './payment-method.component';
import { InvoiceService } from '../invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../../common/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PaymentMethodComponent', () => {
  let component: PaymentMethodComponent;
  let fixture: ComponentFixture<PaymentMethodComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let translateService: any;
  let translateServiceMock: any;

  beforeEach(async () => {

    invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['payInvoice']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
        { provide: MatDialog, useValue: dialogSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ],
      imports: [
        PaymentMethodComponent,
        BrowserAnimationsModule, 
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize forms and set default language on init', () => {
    storageServiceSpy.getItem.and.returnValue('en');
    component.ngOnInit();
    
    expect(component.creditCardForm).toBeTruthy();
    expect(component.pseForm).toBeTruthy();
  });

  it('should set default language to "es" if no language in storage', () => {
    storageServiceSpy.getItem.and.returnValue(null);
    component.ngOnInit();
    
  });

  it('should mark pseForm as invalid if required fields are missing', () => {
    component.ngOnInit();
    component.pseForm.patchValue({
      ownerName: '',
      identityType: '',
      identityNumber: '',
      personType: '',
      bank: ''
    });
    
    expect(component.pseForm.invalid).toBeTrue();
  });

  it('should mark creditCardForm as invalid if required fields are missing', () => {
    component.ngOnInit();
    component.creditCardForm.patchValue({
      creditCardNumber: '',
      ownerName: '',
      cvv: '',
      expirationDate: ''
    });
    
    expect(component.creditCardForm.invalid).toBeTrue();
  });

  it('should validate CVV length correctly', () => {
    component.ngOnInit();
    const cvvControl = component.creditCardForm.get('cvv');
    
    cvvControl?.setValue('12');
    expect(component.cvvSizeValidator()(cvvControl as any)).toEqual({ invalidLength: true });
    
    cvvControl?.setValue('123');
    expect(component.cvvSizeValidator()(cvvControl as any)).toBeNull();
  });

  it('should validate expiration date correctly', () => {
    component.ngOnInit();
    const expDateControl = component.creditCardForm.get('expirationDate');
    
    expDateControl?.setValue('01/20');
    expect(component.expirationDateValidator()(expDateControl as any)).toEqual({ dateInPast: true });
    
    const currentDate = new Date();
    const futureYear = (currentDate.getFullYear() + 1).toString().slice(-2);
    expDateControl?.setValue(`12/${futureYear}`);
    expect(component.expirationDateValidator()(expDateControl as any)).toBeNull();
  });

  it('should open PaymentDialogComponent after successful invoice payment', () => {
    component.ngOnInit();
    component.isCreditCard = true;
    component.creditCardForm.patchValue({
      creditCardNumber: '1234567890123456',
      ownerName: 'Test User',
      cvv: '123',
      expirationDate: '12/25'
    });
    invoiceServiceSpy.payInvoice.and.returnValue(of({ success: true }));
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ success: true })
    } as any);

    component.payInvoice();
    expect(invoiceServiceSpy.payInvoice).toHaveBeenCalledWith('123', 2);
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should change isCreditCard when event is checked', () => {
    component.isCreditCard = true;
    const event = { checked: true };
    component.onPseChange(event);
    expect(component.isCreditCard).toBeFalse();
  });

  it('should change isPse when event is checked', () => {
    component.isCreditCard = true;
    const event = { checked: true };
    component.onCreditCardChange(event);
    expect(component.isPse).toBeFalse();
  });

  it('should navigate to dashboard/invoice after closing dialog', () => {
    component.ngOnInit();
    component.isCreditCard = true;
    component.creditCardForm.patchValue({
      creditCardNumber: '1234567890123456',
      ownerName: 'Test User',
      cvv: '123',
      expirationDate: '12/25'
    });
    invoiceServiceSpy.payInvoice.and.returnValue(of({ success: true }));
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ success: true })
    } as any);
    
    component.payInvoice();
    dialogSpy.open(PaymentDialogComponent, {}).afterClosed().subscribe(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/invoice']);
    });
  });
  it('should invlaid form creadit card', () => {
    component.ngOnInit();
    component.isCreditCard = true;
    component.creditCardForm.patchValue({
      creditCardNumber: '1234567890123456',
      ownerName: 'Test User',
      cvv: '1234567',
      expirationDate: '12/25'
    });
    
    component.payInvoice();
    
    expect(component.creditCardForm.invalid).toBeTrue();
  });
});
