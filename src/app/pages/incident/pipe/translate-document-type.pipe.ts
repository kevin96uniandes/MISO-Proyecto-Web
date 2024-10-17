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
        'Cédula_Cuidadania': 'Cédula de Ciudadanía',
        'Cédula_Extrangeria': 'Cédula de Extranjería',
        'Pasaporte': 'Pasaporte'
      },
      en: {
        'Cédula_Cuidadania': 'Citizenship ID',
        'Cédula_Extrangeria': 'Foreigner ID',
        'Pasaporte': 'Passport'
      }
    };

    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return translations[language][value] || value; 
  }
}