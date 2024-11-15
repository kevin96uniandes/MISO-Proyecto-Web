import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Incident } from '../incident/interfaces/incident';
import { User } from '../auth/user';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private userUrl: string = environment.apiUrl + '/user/';
  private incidentUrl: string = environment.incidentUrl;
  
  constructor(private httpClient: HttpClient) { }

  
  getIncidences(){
    return this.httpClient.get<Incident[]>(this.incidentUrl+`all`)
  }

  getUser(userId: Number){
    return this.httpClient.get<User>(this.userUrl+`get/${userId}`)
  }

}
