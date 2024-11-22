import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EmailDialogComponent } from './email-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { ReportService } from '../report.service';
import { of, throwError } from 'rxjs';

describe('EmailDialogComponent', () => {
  let component: EmailDialogComponent;
  let fixture: ComponentFixture<EmailDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EmailDialogComponent>>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockReportService: jasmine.SpyObj<ReportService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['use']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem']);
    mockReportService = jasmine.createSpyObj('ReportService', ['sendReportByEmail']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: ReportService, useValue: mockReportService },
        { provide: MAT_DIALOG_DATA, useValue: { someFilter: 'testFilter' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct language', () => {
    mockStorageService.getItem.and.returnValue('en');
    component.ngOnInit();
    expect(mockTranslateService.use).toHaveBeenCalledWith('en');
  });

  it('should default to "es" language if no language is set', () => {
    mockStorageService.getItem.and.returnValue(null);
    component.ngOnInit();
    expect(mockTranslateService.use).toHaveBeenCalledWith('es');
  });

  it('should close the dialog when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should send email when onSend is called and form is valid', fakeAsync(() => {
    component.emailForm.setValue({ email: 'test@example.com' });
    mockReportService.sendReportByEmail.and.returnValue(of(null));

    component.onSend();

    expect(mockReportService.sendReportByEmail).toHaveBeenCalledWith({
      someFilter: 'testFilter',
      email: 'test@example.com',
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith('test@example.com');
    expect(component.loading).toBeFalse();
  }));

  it('should handle errors when onSend fails', () => {
    component.emailForm.setValue({ email: 'test@example.com' });
    mockReportService.sendReportByEmail.and.returnValue(throwError(() => new Error('Error')));

    spyOn(window, 'alert');

    component.onSend();

    expect(mockReportService.sendReportByEmail).toHaveBeenCalledWith({
      someFilter: 'testFilter',
      email: 'test@example.com',
    });
    expect(window.alert).toHaveBeenCalledWith('Hubo un error al enviar el correo. Por favor, intenta nuevamente.');
  });

  it('should not send email when form is invalid', () => {
    component.emailForm.setValue({ email: '' });

    component.onSend();

    expect(component.loading).toBeFalse();
    expect(mockReportService.sendReportByEmail).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
