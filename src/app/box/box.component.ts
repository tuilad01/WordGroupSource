import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { ActivatedRoute } from "@angular/router";

import { WordService } from "./../word.service";
import { GroupService } from "./../group.service";
import { LocalStorageService } from "./../local-storage.service";

import { environment } from './../../environments/environment';
import { Group } from '../group';
import { Word } from '../word';
import { ResultResponse } from '../resultResponse';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'scale(1.1) rotateY(180deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'scale(1.0) rotateY(0)',
        })
      ),
      transition('active => inactive', animate('400ms ease-out')),
      transition('inactive => active', animate('400ms ease-in')),
    ]),
  ]
})
export class BoxComponent implements OnInit {

  id = 0;
  speech = "";
  data = [];

  state = 1;

  system = {
    box1: "SYSTEMBOX1",
    box2: "SYSTEMBOX2",
    box3: "SYSTEMBOX3",
  }

  stateData1 = [];
  stateData2 = [];
  stateData3 = [];

  systemBox = {};

  isChanged = false;

  syncStack = 0;

  private intervalSaveState;
  private tryFlipped = false;

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private wordService: WordService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    const learnAllLocal = this.localStorageService.get(environment.settings.learnAllLocal);
    if (learnAllLocal) {
      const objLearnAllLocal = JSON.parse(learnAllLocal);
      this.data = objLearnAllLocal.data;
      this.stateData1 = objLearnAllLocal.stateData1;
      this.stateData2 = objLearnAllLocal.stateData2;
      this.stateData3 = objLearnAllLocal.stateData3;
      this.state = objLearnAllLocal.state;

      const groups = this.localStorageService.getArray(environment.settings.groupLocal);
      if (groups && groups.length) {
        this.findStateDataByBoxNumber(groups, this.system.box1);
        this.findStateDataByBoxNumber(groups, this.system.box2);
        this.findStateDataByBoxNumber(groups, this.system.box3);
      }
    } else {
      const groups = this.localStorageService.getArray(environment.settings.groupLocal);
      if (groups && groups.length) {
        this.stateData1 = this.findStateDataByBoxNumber(groups, this.system.box1);
        this.data = this.stateData1;

        this.stateData2 = this.findStateDataByBoxNumber(groups, this.system.box2);

        this.stateData3 = this.findStateDataByBoxNumber(groups, this.system.box3);
      }
    }



    this.intervalSaveState = setInterval(() => {
      if (this.isChanged) {
        this.saveStateLocal();
        this.isChanged = false;
      }
    }, 5000); // 3 minutes = 180.000
  }

  ngOnDestroy() {
    if (this.intervalSaveState) {
      clearInterval(this.intervalSaveState);
    }
  }

  private findStateDataByBoxNumber(groups, systemBoxName) {
    const systemBox = groups.find(d => d.name === systemBoxName);
    if (systemBox && systemBox.words && systemBox.words.length >= 0) {
      this.systemBox[systemBoxName] = systemBox;
      return systemBox.words.map(word => this.prepareModelWordCard(word));
    }
    return [];
  }

  private prepareModelWordCard(obj) {
    return {
      _id: obj._id,
      name: obj.name,
      mean: obj.mean,
      display: true,
      flipped: false
    }
  }
  flipAll() {
    this.tryFlipped = !this.tryFlipped;
    this.data = this.data.map(d => {
      d.flipped = this.tryFlipped;
      return d;
    });

  }

  random() {
    this.isChanged = true;
    return this.data = this.shuffle(this.data);
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  delete(indexWord) {
    const word = this.data.find((element, index) => {
      return index == indexWord;
    });
    word.display = false;
    this.isChanged = true;
  }

  flipped(id) {
    const word = this.data.find(word => word._id == id);
    word.flipped = !word.flipped;
  }

  listen(str) {
    const arrStr = str.split(" ").map(d => this.jsUcfirst(d));

    const query = arrStr.join("+");
    this.speech = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${query}`;

    window.open(this.speech, '_blank');
  }
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  doneState() {
    // Filter word forget and remember into Arrays
    const arrForget = this.data.filter(word => word.display);
    const arrRemember = this.data.filter(word => !word.display);

    if (this.state === 1 || this.state === 2) {
      // Set forget words into Array Data State 1
      this.stateData1 = arrForget;

      // Reassign data State 2
      this.stateData2 = this.pushRemember_removeForget(this.stateData2, arrForget, arrRemember);

      // Reassign data to display
      this.data = this.state === 1 ? [...this.stateData1, ...this.stateData2] : [...this.stateData1, ...this.stateData2, ...this.stateData3];

      // Next state 2 or 3
      this.state += 1;
    } else if (this.state === 3) {

      const newStateData2 = this.filterRememberbySate(arrRemember, this.stateData1);
      const newStateData3 = this.pushRemember_removeForget_byState(this.stateData3, arrForget, arrRemember, this.stateData2);

      this.stateData1 = arrForget;
      this.stateData2 = newStateData2;
      this.stateData3 = newStateData3;

      // Reassign Data array
      this.data = this.stateData1;
      // Next state 1
      this.state = 1;
    }

    // Flip all
    this.setFlipDefault();
    this.isChanged = true;
  }

  private setFlipDefault() {
    this.data = this.data.map(d => {
      d.display = true;
      d.flipped = false;
      return d;
    });
    return true;
  }

  private pushRemember_removeForget(originArr: Word[], forgetArr: Word[], rememberArr: Word[]): Word[] {
    let result = this.removeObjIfExist(originArr, forgetArr) as Word[];
    result = this.pushObjIfNew(result, rememberArr) as Word[];
    return result;
  }

  private pushRemember_removeForget_byState(originArr: Word[], forgetArr: Word[], rememberArr: Word[], state: Word[]): Word[] {
    let result = this.removeObjIfExist(originArr, forgetArr) as Word[];
    const filterRememberArr = rememberArr.filter(word => state.findIndex(wrd => wrd._id === word._id) !== -1);
    result = this.pushObjIfNew(result, filterRememberArr) as Word[];
    return result;
  }

  private filterRememberbySate(rememberArr: Word[], state: Word[]): Word[] {
    const result = rememberArr.filter(word => state.findIndex(wrd => wrd._id === word._id) !== -1);
    return result;
  }

  private pushObjIfNew(originArr: any[], newArr: any[]): any[] {
    const arrFilter = newArr.filter(d => originArr.findIndex(dd => dd._id == d._id) === -1);
    return [...originArr, ...arrFilter];
  }
  private removeObjIfExist(originArr: any[], newArr: any[]): any[] {
    const arrFilter = originArr.filter(d => newArr.findIndex(dd => dd._id == d._id) === -1);
    return arrFilter;
  }

  private saveStateLocal() {
    const learnAllLocal = {
      data: this.data,
      stateData1: this.stateData1,
      stateData2: this.stateData2,
      stateData3: this.stateData3,
      state: this.state
    };

    this.localStorageService.set(environment.settings.learnAllLocal, learnAllLocal);
  }

  sync() {
    this.syncStack = 0;
    this.updateStateBox(1);
    this.updateStateBox(2);
    this.updateStateBox(3);
  }

  private updateStateBox(number) {
    let model = {
      _id: "",
      name: "",
      description: "",
      words: ""
    };
    switch (number) {
      case 1:
        model._id = this.systemBox[this.system.box1]._id;
        model.name = this.systemBox[this.system.box1].name;
        model.description = this.systemBox[this.system.box1].description;
        model.words = this.stateData1.map(word => word._id).join(",");
        break;
      case 2:
        model._id = this.systemBox[this.system.box2]._id;
        model.name = this.systemBox[this.system.box2].name;
        model.description = this.systemBox[this.system.box2].description;
        model.words = this.stateData2.map(word => word._id).join(",");
        break;
      case 3:
        model._id = this.systemBox[this.system.box3]._id;
        model.name = this.systemBox[this.system.box3].name;
        model.description = this.systemBox[this.system.box3].description;
        model.words = this.stateData3.map(word => word._id).join(",");
        break;

      default:
        return;
    }
    this.groupService.update(model as Group).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        // Do something success
        this.syncStack += 1;
        if (this.syncStack === 3) {
          alert("Sync data box success");
        }
      }
    });
  }
}
