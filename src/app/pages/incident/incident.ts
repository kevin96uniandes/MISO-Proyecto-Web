export interface Incident {
    id: number;                         
    codigo: string;                     
    descripcion: string;                
    asunto: string;                     
    fecha_creacion: Date;               
    fecha_actualizacion: Date;         
    canal_id: number;                   
    usuario_creador_id: number;         
    usuario_asignado_id: number;        
    persona_id: number;                 
    estado_id: number;                
    tipo_id: number;   
    estado_nombre?: string;                
  }
  