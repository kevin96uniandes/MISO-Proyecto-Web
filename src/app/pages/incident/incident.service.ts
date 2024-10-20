import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Person } from '../auth/person';
import { Incident } from './incident';
import { Call } from './calls';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private incidentUrl: string = environment.incidentUrl;
  private personUrl: string = environment.apiUrl + '/user/person';

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
}
