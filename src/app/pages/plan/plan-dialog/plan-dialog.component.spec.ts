import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanDialogComponent } from './plan-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from '../../../common/storage.service';

describe('PlanDialogComponent', () => {
  let component: PlanDialogComponent;
  let fixture: ComponentFixture<PlanDialogComponent>;
  let dialogRefMock: any;
  let translateService: TranslateService;
  let storageServiceMock: any;

  const mockDialogData = {
    plan: 'Plan Básico',
    empresa: 123,
    id: 1
  };

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    storageServiceMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue('es')
    };

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),  // Use the real TranslateModule
        PlanDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: StorageService, useValue: storageServiceMock }  // Provide StorageService mock
      ]
    }).compileComponents();

    // Inject TranslateService for later use
    translateService = TestBed.inject(TranslateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This ensures the templates render
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with injected data', () => {
    expect(component.selectedPlan).toBe(mockDialogData.plan);
    expect(component.empresaId).toBe(mockDialogData.empresa);
    expect(component.newPlanId).toBe(mockDialogData.id);
  });

  it('should close the dialog with plan and empresa IDs when accepted', () => {
    component.onAccept();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      planId: component.newPlanId,
      empresaId: component.empresaId
    });
  });

  it('should close the dialog without data when rejected', () => {
    component.onReject();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });
});
