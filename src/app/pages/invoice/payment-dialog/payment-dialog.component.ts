import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { IncidentTypePipe } from '../../incident/pipe/incident-type.pipe';
import { TranslateDocumentTypePipe } from '../../incident/pipe/translate-document-type.pipe';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    TranslateDocumentTypePipe
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent {

  isPse!: Boolean
  isCreditCard!: Boolean
  pseData!: any
  creditCardData!: any

  constructor(
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private storageService: StorageService,
    private translate: TranslateService,
  ){

  }

  ngOnInit(){
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    this.pseData = this.data.pseData
    this.creditCardData = this.data.creditCardData
    this.isPse = this.data.isPse
    this.isCreditCard = this.data.isCreditCard
  }

  onClose(): void {
    this.dialogRef.close({"msg": "ok"});
  }



}
