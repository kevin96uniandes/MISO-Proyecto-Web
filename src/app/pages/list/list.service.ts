import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Agente } from './list-agents/list-agents.component';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private userUrl: string = environment.apiUrl + '/user/';

  constructor(private httpClient: HttpClient) { }

  
  getAgentsByIdCompany(idCompany: Number){
    return this.httpClient.get<Agente[]>(this.userUrl+`agent/${idCompany}`)
  }

}
