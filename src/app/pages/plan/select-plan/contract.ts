export class Contract {
  empresa_id: Number;
  new_plan_id: Number;

  constructor(
    empresa_id: Number,
    new_plan_id: Number

  ){
    this.empresa_id = empresa_id;
    this.new_plan_id = new_plan_id;
  }
}
