export class Boardfilter {
  canal_id: number;
  estado_id: number;
  fecha_inicio: string;
  fecha_fin: string;

  constructor(
    canal_id: number,
    estado_id: number,
    fecha_inicio: string,
    fecha_fin: string
  ){
    this.canal_id = canal_id;
    this.estado_id = estado_id;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
  }
}
