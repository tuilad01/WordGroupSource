export class Word {
    _id: string;
    name: string;
    mean: string;
    groups: string;

    selected: boolean;

    constructor () {
      this.selected = false;
    }
  }
  