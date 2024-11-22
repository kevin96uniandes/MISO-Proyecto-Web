import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidentsummary } from './interfaces/reportsummary';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportUrl: string = environment.reportUrl;

constructor(private httpClient: HttpClient) { }
  saveReport(reportData: any): Observable<any> {
    return this.httpClient.post(this.reportUrl+`generate`, reportData, { responseType: 'blob'});
  }
}
