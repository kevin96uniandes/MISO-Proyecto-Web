import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../../../common/storage.service';
import { incidentType } from './pipe-resources';

@Pipe({
  name: 'incidentType',
  standalone: true
})
export class IncidentTypePipe implements PipeTransform {

  lang:any

  constructor(@Inject(LOCALE_ID) private locale: string,     
  private storageService: StorageService,
) {
   this.lang = (this.storageService.getItem("language")) ? this.storageService.getItem("language") : 'es'
   console.log(this.lang)
}


  transform(value: string): string {
    const language = this.lang.startsWith('en') ? 'en' : 'es'; 
    return incidentType[language][value] || value; 
  }

}
