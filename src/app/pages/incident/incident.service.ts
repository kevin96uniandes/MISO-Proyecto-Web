import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl: string = environment.incidentUrl + 'create';


  constructor(private httpClient: HttpClient) { }

  createIncident(formData: FormData) {
    return this.httpClient.post(this.apiUrl, formData)
  }
}
