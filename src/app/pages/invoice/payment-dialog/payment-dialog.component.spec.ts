import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDialogComponent } from './payment-dialog.component';
import { StorageService } from '../../../common/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('PaymentDialogComponent', () => {
  let component: PaymentDialogComponent;
  let fixture: ComponentFixture<PaymentDialogComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PaymentDialogComponent>>;

  const mockData = {
    pseData: { transactionId: '12345', bankName: 'Test Bank' },
    creditCardData: { cardNumber: '**** **** **** 1234', expiryDate: '12/25' },
    isPse: true,
    isCreditCard: false
  };

  beforeEach(async () => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ],
      imports: [PaymentDialogComponent, BrowserAnimationsModule, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set language from storage service on init', () => {
    storageServiceSpy.getItem.and.returnValue('en');
    component.ngOnInit();
  });

  it('should initialize data correctly from injected MAT_DIALOG_DATA', () => {
    component.ngOnInit();
    expect(component.pseData).toEqual(mockData.pseData);
    expect(component.creditCardData).toEqual(mockData.creditCardData);
    expect(component.isPse).toBeTrue();
    expect(component.isCreditCard).toBeFalse();
  });

  it('should use default language "es" if no language is set in storage', () => {
    storageServiceSpy.getItem.and.returnValue(null);
    component.ngOnInit();
  });

  it('should close dialog with message "ok" when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ msg: 'ok' });
  });
});
