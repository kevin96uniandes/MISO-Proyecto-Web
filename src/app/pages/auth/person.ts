export interface Person {
    id: number;
    nombres: string;
    apellidos: string;
    tipo_identificacion: string;
    numero_identificacion: string;
    telefono?: string;  
    correo_electronico?: string;  
    fecha_creacion: Date;
    fecha_actualizacion: Date;
  }