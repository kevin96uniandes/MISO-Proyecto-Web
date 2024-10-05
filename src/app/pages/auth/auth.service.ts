import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Login } from './login/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/auth/login`, { "username": login.username, "password": login.password});
  }

  validateToken(token: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/auth/validate-token`, { "token": `Bearer ${token}` });
  }
}
