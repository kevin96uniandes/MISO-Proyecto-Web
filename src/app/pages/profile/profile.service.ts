import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Incident } from '../incident/interfaces/incident';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private incidentUrl: string = environment.incidentUrl;

  constructor(private httpClient: HttpClient) { }

  
  getIncidences(){
    return this.httpClient.get<Incident[]>(this.incidentUrl+`all`)
  }

}
