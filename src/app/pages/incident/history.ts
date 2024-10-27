import { User } from "../auth/user";
import { Evidence } from "./evidence";

export interface History {
    estado_id: number;
    evidence?: Evidence[];
    fecha_creacion: string;
    id: string;
    incidencia_id: number;
    observaciones: string;
    usuario_asignado_id: number;
    usuario_creador_id: number;
    usuario_creador?: User
  }
  