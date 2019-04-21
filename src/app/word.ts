import { Group } from "./group";

export class Word {
    _id: string;
    name: string;
    mean?: string;
    groups?: Group[] | string; 

    selected?: boolean;

    constructor () {
      this.selected = false;
    }
  }
  