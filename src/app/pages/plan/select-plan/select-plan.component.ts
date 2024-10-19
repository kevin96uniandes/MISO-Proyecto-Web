import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    CommonModule
  ],
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {

  activePlanId: number | null = null;

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
        console.log('Plan activo')
        this.activePlanId = response.plan_id;
        console.log('Plan activo' + this.activePlanId)
      },
      (error) => {
        console.log('No hay plan')
        console.error('Error al obtener el plan activo:', error);
        this.activePlanId = null;
      }
    );
  }

  isActivePlan(planId: number): boolean {
    console.log('El plan es' + planId + 'this ' + this.activePlanId)
    return this.activePlanId === planId;
  }

  openDialog(planName: string): void {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      data: { plan: planName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Plan seleccionado:', planName);
      } else {
        console.log('Selección cancelada');
      }
    });
  }

}
