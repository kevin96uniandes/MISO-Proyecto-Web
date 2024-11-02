import { Pipe, PipeTransform, Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { identityType } from './pipe-resources';


@Pipe({
  name: 'translateDocumentType',
  standalone: true,
})
export class TranslateDocumentTypePipe implements PipeTransform {

  lang:any

  constructor(@Inject(LOCALE_ID) private locale: string,     
  private storageService: StorageService,
) {
   this.lang = (this.storageService.getItem("language")) ? this.storageService.getItem("language") : 'es'
   console.log(this.lang)
}

  transform(value: any): string {
    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return identityType[language][`${value}`] || `${value}`; 
  }
}