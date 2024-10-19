import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PlanDialogComponent } from '../plan-dialog/plan-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../../common/storage.service';
import { PlanService } from '../plan.service';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {

  activePlanId: number | null = null;
  selectedCurrency: string = 'COP';
  price1COP: number = 200;
  price1USD: number = 47;
  price2COP: number = 300;
  price2USD: number = 70;
  price3COP: number = 500;
  price3USD: number = 118;

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    const empresaId = decoded["id_company"];

    this.planService.getActivePlan(empresaId).subscribe(
      (response) => {
        this.activePlanId = response.plan_id;
        console.log('Plan activo' + this.activePlanId)
      },
      (error) => {
        console.error('Error al obtener el plan activo:', error);
        this.activePlanId = null;
      }
    );
  }

  isActivePlan(planId: number): boolean {
    return this.activePlanId == planId;
  }

  openDialog(planName: string, planId: number): void {
    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    const empresaId = decoded["id_company"];
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      data: { plan: planName, id: planId, empresa: empresaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const contractUpdate = {
          empresa_id: result.empresaId,
          new_plan_id: result.planId
        };

        this.planService.updateContract(contractUpdate).subscribe(response => {
          console.log('Plan actualizado correctamente', response);
          this.activePlanId = response['plan_id'];
        }, error => {
          console.error('Error al actualizar el plan', error);
        });
      } else {
        console.log('Selección cancelada');
      }
    });
  }

  getPrice1(): number {
    return this.selectedCurrency === 'COP' ? this.price1COP : this.price1USD;
  }

  getPrice2(): number {
    return this.selectedCurrency === 'COP' ? this.price2COP : this.price2USD;
  }

  getPrice3(): number {
    return this.selectedCurrency === 'COP' ? this.price3COP : this.price3USD;
  }
}
