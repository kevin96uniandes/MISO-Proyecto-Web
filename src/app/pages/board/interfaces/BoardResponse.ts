export class BoardResponse {
  channels: BoardPercentage[];

  constructor(channels: BoardPercentage[]){
    this.channels = channels
  }
}

class BoardPercentage {
  channel: string;
  value: number;

  constructor(
    channel: string, value: number
  ) {
    this.channel = channel;
    this.value = value;
  }
}
