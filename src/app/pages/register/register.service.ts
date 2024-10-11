import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { RegisterClient } from './register-client/register-client';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerClient(registerClient: RegisterClient): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register/client`, { "nombre_completo": registerClient.nombre_completo, "email": registerClient.email,
      "tipo_documento": registerClient.tipo_documento, "numero_documento": registerClient.numero_documento, "sector": registerClient.sector,
      "telefono": registerClient.telefono, "pais": registerClient.pais, "usuario": registerClient.usuario, "contrasena": registerClient.contrasena,
      "confirmar_contrasena": registerClient.confirmar_contrasena});
  }
}
