import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanDialogComponent } from './plan-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('PlanDialogComponent', () => {
  let component: PlanDialogComponent;
  let fixture: ComponentFixture<PlanDialogComponent>;
  let dialogRefMock: any;

  const mockDialogData = {
    plan: 'Plan Básico',
    empresa: 123,
    id: 1
  };

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, NoopAnimationsModule, PlanDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto asegura que las plantillas se rendericen
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
