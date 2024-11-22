import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../common/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class EmailDialogComponent implements OnInit {
  emailForm!: FormGroup;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<EmailDialogComponent>,
    private fb: FormBuilder,
    private translate: TranslateService,
    private storageService: StorageService,
    private reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public filters: any
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.emailForm.valid) {
      this.loading = true;
      const email = this.emailForm.value.email;

      const payload = {
        ...this.filters,
        email
      };

      this.reportService.sendReportByEmail(payload).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(email);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al enviar el correo:', err);
          alert('Hubo un error al enviar el correo. Por favor, intenta nuevamente.');
        }
      });
    }
  }

}
