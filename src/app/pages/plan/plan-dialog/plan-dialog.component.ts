import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';

@Component({
  selector: 'app-plan-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private storageService: StorageService,
  ) {
    this.selectedPlan = this.data.plan;
    this.empresaId = this.data.empresa;
    this.newPlanId = this.data.id;
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')
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
