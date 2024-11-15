export class Boardfilter {
  canal_id: number;
  state: number;
  start_date: string;
  end_date: string;

  constructor(
    canal_id: number,
    state: number,
    start_date: string,
    end_date: string
  ){
    this.canal_id = canal_id;
    this.state = state;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
