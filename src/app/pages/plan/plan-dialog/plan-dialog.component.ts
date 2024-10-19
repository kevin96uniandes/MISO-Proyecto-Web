import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent {
  selectedPlan: any;
  empresaId: any;
  newPlanId: any;

  constructor(
    public dialogRef: MatDialogRef<PlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedPlan = this.data.plan;
    this.empresaId = this.data.empresa;
    this.newPlanId = this.data.id;
  }

  onReject(): void {
    this.dialogRef.close(false);
  }

  onAccept(): void {
    this.dialogRef.close({
      planId: this.newPlanId,
      empresaId: this.empresaId
    });
  }
}
