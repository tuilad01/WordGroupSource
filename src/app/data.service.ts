import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Group } from './group';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private groupSource = new BehaviorSubject<Group>(new Group);
  currentGroup = this.groupSource.asObservable();

  constructor() { }

  changeGroup(group: Group) {
    this.groupSource.next(group);
  }

}
