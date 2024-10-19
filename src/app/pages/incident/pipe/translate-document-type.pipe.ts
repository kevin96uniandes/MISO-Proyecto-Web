import { Pipe, PipeTransform, Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { StorageService } from '../../../common/storage.service';

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

  transform(value: string): string {
    const translations: any = {
      es: {
        '1': 'Cédula de Ciudadanía',
        '2': 'Cédula de Extranjería',
        '4': 'Pasaporte'
      },
      en: {
        '1': 'Citizenship ID',
        '2': 'Foreigner ID',
        '4': 'Passport'
      }
    };

    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return translations[language][value] || value; 
  }
}