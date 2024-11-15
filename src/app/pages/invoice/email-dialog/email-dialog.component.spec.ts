import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDialogComponent } from './email-dialog.component';
import { StorageService } from '../../../common/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('EmailDialogComponent', () => {
  let component: EmailDialogComponent;
  let fixture: ComponentFixture<EmailDialogComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EmailDialogComponent>>;

  beforeEach(async () => {

    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'])

    await TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      imports: [
         EmailDialogComponent,
         BrowserAnimationsModule, 
         TranslateModule.forRoot() ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should close dialog with false when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should validate empty email', () => {
    component.sendEmail('');
    expect(component.emptyEmail).toBeTrue();
    expect(component.invalidFormatEmail).toBeTrue();
  });

  it('should validate incorrect email format', () => {
    component.sendEmail('invalidemail');
    expect(component.emptyEmail).toBeFalse();
    expect(component.invalidFormatEmail).toBeTrue();
  });

  it('should close dialog with email if email is valid', () => {
    const email = 'test@example.com';
    component.sendEmail(email);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ email: email });
  });

  it('should not close dialog if email is empty', () => {
    component.sendEmail('');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should not close dialog if email has invalid format', () => {
    component.sendEmail('invalidemail');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close dialog with email if email format is correct', () => {
    component.sendEmail('test@example.com');
    expect(component.emptyEmail).toBeFalse();
    expect(component.invalidFormatEmail).toBeFalse();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should not close dialog if email is empty or invalid', () => {
    component.sendEmail('');
    expect(component.emptyEmail).toBeTrue();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();

    component.sendEmail('invalidemail');
    expect(component.invalidFormatEmail).toBeTrue();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
