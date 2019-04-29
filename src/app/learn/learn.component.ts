import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GroupService } from './../group.service';
import { LocalStorageService } from './../local-storage.service';

import { environment } from './../../environments/environment';


@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
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
export class LearnComponent implements OnInit {

  dataTemp = [];
  data = [];

  temp = "";

  tryFlipped = false;

  url_word = environment.baseUrl + "/word";
  url_group = environment.baseUrl + "/group";

  fieldLocalStorageGroup = "groups";

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Load group and word from cache if cache setting enabled
      if (this.localStorageService.cacheLocal()) {
        if (this.localStorageService.get(this.fieldLocalStorageGroup)) {
          const groups = this.localStorageService.getArray(this.fieldLocalStorageGroup);
          if (groups) {
            const group = groups.find(d => d._id === id);
            if (group) {
              this.data = group.words.map(word => this.prepareModelWordCard(word));
            }
          }
        }
      } else {
        this.groupService.get(id).subscribe(response => {
          if(response && response.length && response[0].words && (response[0].words instanceof Array)) {
            this.data = response[0]["words"].map(word => this.prepareModelWordCard(word));
          }
        });
      }
    }
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

  random() {
    return this.data = this.shuffle(this.data);
  }

  delete(indexWord) {
    const word = this.data.find((element, index) => {
      return index == indexWord;
    });
    return word.display = false;
  }

  reset() {
    const firstWord = this.data[0];
    const flipped = !firstWord.flipped;

    for (let i = 0; i < this.data.length; i++) {
      const word = this.data[i];
      word.display = true;
      word.flipped = flipped;
    }
  }

  save() {
    const data = [...this.data.map(word => {
      return {
        _id: word._id,
        display: word.display
      };
    })]
    this.dataTemp = data;
  }

  dispose() {
    return this.dataTemp = [];
  }

  try() {
    this.tryFlipped = !this.tryFlipped;
    for (let i = 0; i < this.dataTemp.length; i++) {
      const wordTemp = this.dataTemp[i];

      for (let j = 0; j < this.data.length; j++) {
        const word = this.data[j];

        if (word._id == wordTemp._id) {
          word.display = wordTemp.display;
          word.flipped = this.tryFlipped;
          break;
        }
      }

    }
  }

  flipped(id) {
    const word = this.data.find(word => word._id == id);
    word.flipped = !word.flipped;
  }

}
