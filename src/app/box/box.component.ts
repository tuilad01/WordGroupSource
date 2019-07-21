import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { ActivatedRoute } from "@angular/router";

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

  id =  0;
  speech = "";
  data = [
    // {
    //   _id: "123dsdfla",
    //   name: "word name",
    //   mean: "word mean",
    //   flipped: false,
    //   display: true
    // },
    // {
    //   _id: "123dsdfl33a",
    //   name: "word name 2",
    //   mean: "word mean 2",
    //   flipped: false,
    //   display: true
    // }
  ];

  state = 1;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.id = param['id']);
  }

  delete(indexWord) {
    const word = this.data.find((element, index) => {
      return index == indexWord;
    });
    return word.display = false;
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

}
