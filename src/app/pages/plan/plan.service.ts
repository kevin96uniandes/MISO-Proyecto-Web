import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Plan } from './select-plan/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private baseUrl = environment.planUrl;

  constructor(private http: HttpClient) { }

  getActivePlan(empresaId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}get/${empresaId}`);
  }

  updateContract( updateContract: Plan): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}update/contract`, {"empresa_id": updateContract.empresa_id, "new_plan_id": updateContract.new_plan_id});
  }
}
