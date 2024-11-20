import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { invoiceStatus } from './pipe-resource';

@Pipe({
  name: 'invoiceState',
  standalone: true
})
export class InvoiceStatePipe implements PipeTransform {

  
  lang:any

  constructor(@Inject(LOCALE_ID) private locale: string,     
  private storageService: StorageService,
) {
   this.lang = (this.storageService.getItem("language")) ? this.storageService.getItem("language") : 'es'
   console.log(this.lang)
}


  transform(value: any): string {

    console.log(value, this.lang)

    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return invoiceStatus[language][`${value}`] || `${value}`; 
  }
}
