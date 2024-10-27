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