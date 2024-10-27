import { User } from "../auth/user";
import { Person } from "../auth/person";

export interface Incident {
    id: number;                         
    codigo: string;                     
    descripcion: string;                
    asunto: string;                     
    fecha_creacion: Date;               
    fecha_actualizacion: Date;         
    canal_id: number;     
    canal_nombre: number;                                 
    usuario_creador_id: number;         
    usuario_asignado_id: number;        
    persona_id: number;                 
    estado_id: number;  
    tipo_id: number;  
    person?: Person;
    usuario_creador?: User
    usuario_asignado?: User                                                
  }
  