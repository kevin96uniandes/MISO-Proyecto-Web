import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../common/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReportService } from './report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()]
})
export class ReportComponent implements OnInit {
  reportForm!: FormGroup;

  constructor(
    private translate: TranslateService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    this.reportForm = this.fb.group({
      nombre_reporte: ['', Validators.required],
      canal_id: [''],
      estado_id: [''],
      tipo_id: [''],
      fecha_inicio: [''],
      fecha_fin: ['']
    });
  }

  saveReport(): void {
    if (this.reportForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos obligatorios.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const formData = this.reportForm.value;

    const formatDate = (date: string | null) => {
      if (!date) return null;
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const processedData = {
      ...formData,
      canal_id: formData.canal_id || null,
      estado_id: formData.estado_id || null,
      tipo_id: formData.tipo_id || null,
      fecha_inicio: formatDate(formData.fecha_inicio),
      fecha_fin: formatDate(formData.fecha_fin)
    };

    this.reportService.saveReport(processedData).subscribe({
      next: (response) => {
        const blobUrl = URL.createObjectURL(response);
        window.open(blobUrl, '_blank');
        this.snackBar.open('Reporte guardado exitosamente.', 'Cerrar', {
          duration: 7000
        });
        this.reportForm.reset();
      },
      error: (err) => {
        this.snackBar.open('Error al guardar el reporte. Por favor intenta nuevamente.', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  clearFilters(): void {
    this.reportForm.reset({
      nombre_reporte: '',
      canal_id: null,
      estado_id: null,
      tipo_id: null,
      fecha_inicio: null,
      fecha_fin: null
    });

    this.snackBar.open('Filtros limpios.', 'Cerrar', {
      duration: 2000
    });
  }

  openEmailDialog(): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '792px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open(`Correo enviado a: ${result}`, 'Cerrar', { duration: 3000 });
      }
    });
  }
}
