import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Boardfilter } from './interfaces/boardfilter';
import { Observable } from 'rxjs';
import { Boardpercentage } from './interfaces/boardpercentage';
import { Incidentsummary } from './interfaces/boardsummary';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private incidentUrl: string = environment.incidentUrl;
  private personUrl: string = environment.apiUrl + '/user/person';
  private userUrl: string = environment.apiUrl + '/user/';

constructor(private httpClient: HttpClient) { }
  getIncidentPercentage(filters: Boardfilter): Observable<Boardpercentage> {
    const params = this.createHttpParams(filters);
    return this.httpClient.get<Boardpercentage>(`${this.incidentUrl}channels/percentage`, { params });
  }

  getIncidentSummary(filters: Boardfilter): Observable<Incidentsummary> {
    const params = this.createHttpParams(filters);
    return this.httpClient.get<Incidentsummary>(`${this.incidentUrl}summary`, { params });
  }

  private createHttpParams(filters: Boardfilter): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
