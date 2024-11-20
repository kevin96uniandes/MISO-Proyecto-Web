import { Component } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatLabel,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './email-dialog.component.html',
  styleUrl: './email-dialog.component.scss'
})
export class EmailDialogComponent {

  emptyEmail!: boolean
  invalidFormatEmail!: boolean

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<EmailDialogComponent>,

  ) {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  sendEmail(email: string) {
    this.validateEmail(email)
    if (!this.emptyEmail && !this.invalidFormatEmail) {
    this.validateEmail(email)
        this.dialogRef.close({"email": email});
    }
  }

  validateEmail(email: string) {
    this.emptyEmail = false
    this.invalidFormatEmail = false

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      this.emptyEmail = true
    }

    if (!emailRegex.test(email)) {
      this.invalidFormatEmail = true
    }

  }
}
