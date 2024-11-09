import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from '../invoice.service';
import { StorageService } from '../../../common/storage.service';
import { Invoice } from '../invoice';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-detail-invoice',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    MatSelectModule,
    MatIconModule,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent {
 
  invoice!: Invoice
  month!: string
  lang!: string
  currency!: string

  
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private invoiceService: InvoiceService,
    private storageService: StorageService,
    private router: Router){}

    ngOnInit(){
      this.lang = this.storageService.getItem("language") ?? 'es'
      this.translate.use(this.lang)

      this.currency = this.lang === 'es' ? 'COP' : 'USD'

      const date = new Date();
      const currentMonth = date.getMonth() + 1;
      this.month = ""+currentMonth

      this.getInvoice()
    }

    getInvoice(){
      let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);  
      let id_company = decoded["id_company"];

      this.invoiceService.getInvoice(this.month, id_company).subscribe({
        next: (invoice: Invoice) => {
          console.log(invoice)
          this.invoice = invoice
          if(this.currency === 'USD'){
           this.onCurrencyChange()
          }
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error.msg,
          });
          console.log(error);
        } 
      })
    }

    openSendEmailDialog(){
      const dialogRef = this.dialog.open(EmailDialogComponent, {
        disableClose: true
       });

       dialogRef.afterClosed().subscribe({
        next: (responseDialog) => {
          const request = {
            "email":responseDialog.email,
            "invoice_id": this.invoice.id,
            "lang": this.lang
          }

          console.log(request)

          this.invoiceService.sendInvoicePdfFile(request).subscribe({
            next: (response: any) => {
              if(response.status_code == 202){
                Swal.fire({
                  icon: 'success',
                  title: `el correo fue enviado con exito a ${responseDialog.email}`,
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#82BDAE'
                })
              }
            }
          })
        }
       })
    }

    goToPayment(){
      this.router.navigate(['/dashboard/invoice/payment-method']);    
    }

    openInvoiceFile(){
      this.invoiceService.getInvoicePdfFile(this.invoice.id, this.lang ?? 'es').subscribe({
        next: (invoicePdf) => {
          const blobUrl = URL.createObjectURL(invoicePdf);
          window.open(blobUrl, '_blank');
        }
      })
    }

    onCurrencyChange(): void {
      console.log('entre', this.currency)

      const dolarValue = 4300

      if(this.currency === 'COP'){
        this.invoice.plan_precio_total *= dolarValue
        this.invoice.incidencia_correo_precio_total *= dolarValue
        this.invoice.incidencia_llamadas_precio_total *= dolarValue
        this.invoice.incidencia_movil_precio_total *= dolarValue
        this.invoice.valor_pagar *= dolarValue

        this.lang = 'es'
        this.translate.use(this.lang)
      }

      if(this.currency === 'USD'){
        this.invoice.plan_precio_total /= dolarValue
        this.invoice.incidencia_correo_precio_total /= dolarValue
        this.invoice.incidencia_llamadas_precio_total /= dolarValue
        this.invoice.incidencia_movil_precio_total /= dolarValue
        this.invoice.valor_pagar /= dolarValue

        this.lang = 'en'
        this.translate.use(this.lang)

      }
    }

}
