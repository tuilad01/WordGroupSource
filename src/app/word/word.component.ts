import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Word } from "./../word";

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  checkAll = false;

  controls = {
    add: false,
    search: false,
    map: false,
    edit: false,   
    more: false 
  }

  data: Word[] = [
    {
      _id: "1",
      name: "Voluptate 1",
      mean: "Aliqua Dolore minim ea sit ex duis labore sunt tempor.",
      groups: "",
      selected: false
    },
    {
      _id: "2",
      name: "Voluptate 2",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "3",
      name: "Voluptate 3",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "4",
      name: "Voluptate 4",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "5",
      name: "Voluptate 5",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "6",
      name: "Voluptate 6",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "7",
      name: "Voluptate 7",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "8",
      name: "Voluptate 8",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "9",
      name: "Voluptate 9",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "10",
      name: "Voluptate 10",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "11",
      name: "Voluptate 11",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "12",
      name: "Voluptate 12",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "13",
      name: "Voluptate 13",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "14",
      name: "Voluptate 14",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "15",
      name: "Voluptate 15",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "16",
      name: "Voluptate 16",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    {
      _id: "17",
      name: "Voluptate 17",
      mean: "Aliqua",
      groups: "",
      selected: false
    },
    
  ];


  constructor(
    private location: Location
  ) { }

  ngOnInit() { 
  }

  add() {

  }

  edit() {

  }

  search() {

  }

  map() {

  }

  more () {
    
  }

  delete() {

  }

  toggleCheckAll(value: boolean) {
    this.checkAll = value;
    this.data.map(word => word.selected = value);
  }

  goBack(): void {
    this.location.back();
  }

}
