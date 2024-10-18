import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PlanDialogComponent } from '../plan-dialog/plan-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  ],
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent {

  constructor(
    public dialog: MatDialog
  ) { }

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
