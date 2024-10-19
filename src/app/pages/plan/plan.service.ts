import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private baseUrl = environment.planUrl;

  constructor(private http: HttpClient) { }

  getActivePlan(empresaId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}get/${empresaId}`);
  }
}
