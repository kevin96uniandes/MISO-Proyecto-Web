import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Invoice } from './invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceUrl: string = environment.invoiceUrl;

  constructor(private httpClient: HttpClient) { }

  getInvoice(month: string, empresa_id: string){
    return this.httpClient.post<Invoice>(this.invoiceUrl+`create/${month}/${empresa_id}`, {})
  }

  getInvoicePdfFile(invoiceId: number, lang: string){
    return this.httpClient.get(this.invoiceUrl+`get-invoice-pdf/${invoiceId}/${lang}`, {
      responseType: 'blob'
    })
  }

  sendInvoicePdfFile(request: any){
    return this.httpClient.post(this.invoiceUrl+`send-email`, request)
  }

  payInvoice(idInvoice: string, paymentMethodId: number){

    const request = {
      "id_invoice": idInvoice,
      "payment_method_id": paymentMethodId
    } 

    return this.httpClient.post(this.invoiceUrl+`pay`, request)
  }
}
