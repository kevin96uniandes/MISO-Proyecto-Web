import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { incidentStatus } from './pipe-resources';

@Pipe({
  name: 'incidentStatus',
  standalone: true
})
export class IncidentStatusPipe implements PipeTransform {

  lang:any

  constructor(@Inject(LOCALE_ID) private locale: string,     
  private storageService: StorageService,
) {
   this.lang = (this.storageService.getItem("language")) ? this.storageService.getItem("language") : 'es'
   console.log(this.lang)
}


  transform(value: any): string {
    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return incidentStatus[language][`${value}`] || `${value}`; 
  }
}
