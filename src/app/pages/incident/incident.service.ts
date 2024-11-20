import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Person } from '../auth/person';
import { Incident } from './interfaces/incident';
import { Call } from '../call/calls';
import { Product } from './interfaces/product';
import { History } from './interfaces/history';
import { Agente } from '../auth/user';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private incidentUrl: string = environment.incidentUrl;
  private personUrl: string = environment.apiUrl + '/user/person';
  private userUrl: string = environment.apiUrl + '/user/';


  constructor(private httpClient: HttpClient) { }

  createIncident(formData: FormData) {
    return this.httpClient.post(this.incidentUrl+'create', formData)
  }

  getIncidentByIdPerson(id: Number){
    return this.httpClient.get<Incident[]>(this.incidentUrl+`person/${id}`)
  }

  getCallsByIdPerson(id: Number){
    return this.httpClient.get<Call[]>(this.incidentUrl+`calls/${id}`)
  }

  getPersonByIdentity(identityType: string, identityNumber: string) {
   let queryParams = new HttpParams()
    .set('identityType', identityType)
    .set('identityNumber', identityNumber)

    return this.httpClient.get<Person>(this.personUrl, {params: queryParams})
  }

  getProductsByPerson(idPerson: number) {
     return this.httpClient.get<Product[]>(this.personUrl+`/${idPerson}/products`)
   }

   getIncidentById(idIncident: string | number) {
    return this.httpClient.get<Incident>(this.incidentUrl+`get/${idIncident}`)
  }

  getIncidents() {
    return this.httpClient.get<Incident[]>(this.incidentUrl+`all`)
  }

  getHistoryByIncident(idIncident: string | number) {
    return this.httpClient.get<History[]>(this.incidentUrl+`history/${idIncident}`)
  }

  updateIncident(idIncident: Number, formData: FormData) {
    return this.httpClient.put(this.incidentUrl+`update/${idIncident}`,formData)
  }

  getCallById(callId: number) {
    return this.httpClient.get<Call>(this.incidentUrl+`call/${callId}`);
  }

  getAgentsAvaiables(companyId: number) {
    return this.httpClient.get<Agente[]>(this.userUrl+`agent/${companyId}`)
  }
}
