export interface Invoice {
    empresa_id: number;
    estado_factura: string;
    fecha_actualizacion?: string; 
    fecha_creacion: string; 
    fecha_pago: string; 
    id: number;
    incidencia_correo_precio_total: number;
    numero_incidencia_correo: number;
    incidencia_llamadas_precio_total: number;
    numero_incidencia_llamadas: number;
    incidencia_movil_precio_total: number;
    numero_incidencia_movil: number;
    plan_precio_total: number;
    referencia_pago: string;
    valor_pagar: number;
  }