import { Person } from "./person";

export interface User {
    id: number;
    id_persona?: number; 
    id_empresa?: number;
    id_tipousuario: number;
    nombre_usuario: string;
    contrasena: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    es_activo: boolean;
    persona?: Person                         
}

export interface Agente {
    id: number;
    nombre_usuario: string;
    numero_identificacion?: string;
    nombre_completo: string;
    telefono?: string;
    correo_electronico?: string;
  }
  