export class Group {
    _id: string;
    name: string;
    description: string;
    words: string;

    selected: boolean;

    constructor () {
      this.selected = false;
    }
  }
  