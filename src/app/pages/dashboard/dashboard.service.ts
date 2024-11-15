import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private iaUrl: string = environment.apiUrl + '/ia';

  constructor(private httpClient: HttpClient) {}

  predict(data: any): Observable<any> {
    return this.httpClient.post(`${this.iaUrl}/sync`, data)
  }
}
