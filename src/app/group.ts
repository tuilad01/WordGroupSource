import { Word } from "./word";

export class Group {
    _id: string;
    name: string;
    description?: string;
    words?: string | Word[];

    selected?: boolean;

    constructor () {
      this.selected = false;
    }
  }
  