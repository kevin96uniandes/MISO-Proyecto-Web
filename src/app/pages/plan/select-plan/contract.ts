export class Contract {
  es_activo: Boolean;
  plan_id: Number;
  empresa_id: Number;

  constructor(
    es_activo: Boolean,
    plan_id: Number,
    empresa_id: Number
  ){
    this.es_activo = es_activo;
    this.plan_id = plan_id;
    this.empresa_id = empresa_id;
  }
}
