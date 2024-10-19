import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { RegisterClient } from './register-client/register-client';
import { RegisterAgent } from './register-agent/register-agent';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerClient(registerClient: RegisterClient): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register/client`, { "nombre_empresa": registerClient.nombre_empresa, "email": registerClient.email,
      "tipo_identificacion": registerClient.tipo_identificacion, "numero_identificacion": registerClient.numero_identificacion, "sector": registerClient.sector,
      "telefono": registerClient.telefono, "pais": registerClient.pais, "usuario": registerClient.usuario, "contrasena": registerClient.contrasena,
      "confirmar_contrasena": registerClient.confirmar_contrasena});
  }

  registerAgent(registerAgent: RegisterAgent): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register/agent`, { "nombre_completo": registerAgent.nombre_completo,
      "correo_electronico": registerAgent.correo_electronico, "tipo_identificacion": registerAgent.tipo_identificacion,
      "numero_identificacion": registerAgent.numero_identificacion, "telefono": registerAgent.telefono, "usuario": registerAgent.usuario,
      "contrasena": registerAgent.contrasena, "confirmar_contrasena": registerAgent.confirmar_contrasena});
  }
}

