import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { group } from '@angular/animations';

import { GroupService } from './../group.service';
import { WordService } from './../word.service';
import { Group } from '../group';
import { Word } from '../word';
import { Request } from '../request';
import { ResultResponse } from '../resultResponse';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  // @ViewChildren("textBoxName") inputName;

  controlsGroup = {
    add: false,
    search: false,
    map: false,
    edit: false,
    more: false,
    checkAll: false
  }

  controlsWord = {
    search: false,
    checkAll: false
  }

  controlsWordMap = {
    search: true,
    checkAll: false,
  }

  formAdd = {
    name: "",
    description: ""
  }

  formEdit = {
    name: "",
    description: ""
  }

  strSearchGroup = "";
  strSearchWord = "";

  currentGroupEdit: Group;

  data: Group[] = [
    {
      _id: "1",
      name: "Voluptate 1",
      description: "Aliqua Dolore minim ea sit ex duis labore sunt tempor.",
      words: [
        {
          _id: "1",
          name: "Ex adipisicing 1",
          mean: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "2",
          name: "Ex adipisicing 2",
          mean: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "3",
          name: "Ex adipisicing 3",
          mean: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "4",
          name: "Ex adipisicing 4",
          mean: "Sint eu esse eu exercitation fugiat."
        },

      ],
      selected: false
    },
    {
      _id: "2",
      name: "Voluptate 2",
      description: "Aliqua",
      words: [],
      selected: false
    },
    {
      _id: "3",
      name: "Voluptate 3",
      description: "Aliqua",
      words: [],
      selected: false
    },
    {
      _id: "4",
      name: "Voluptate 4",
      description: "Aliqua",
      words: [],
      selected: false
    }
    // ,
    // {
    //   _id: "5",
    //   name: "Voluptate 5",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "6",
    //   name: "Voluptate 6",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "7",
    //   name: "Voluptate 7",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "8",
    //   name: "Voluptate 8",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "9",
    //   name: "Voluptate 9",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "10",
    //   name: "Voluptate 10",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "11",
    //   name: "Voluptate 11",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "12",
    //   name: "Voluptate 12",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "13",
    //   name: "Voluptate 13",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "14",
    //   name: "Voluptate 14",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "15",
    //   name: "Voluptate 15",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "16",
    //   name: "Voluptate 16",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },
    // {
    //   _id: "17",
    //   name: "Voluptate 17",
    //   description: "Aliqua",
    //   words: [],
    //   selected: false
    // },

  ];

  activeGroup: Group;

  dataWord: Word[] = [];


  constructor(
    private location: Location,
    private wordService: WordService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    const request = new Request();
    request.page = 0;
    request.limit = 10;
    this.groupService.getGroups(request).subscribe((response: Group[]) => {
      if (response && response.length) {
        this.data = response;
      }
    });
  }

  add() {
    if (!this.formAdd.name) return;

    const newGroup = new Group();
    newGroup.name = this.formAdd.name;
    newGroup.description = this.formAdd.description;

    this.groupService.addGroup(newGroup).subscribe((response: ResultResponse) => {

      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        this.controlsGroup.add = false;

        this.data.unshift(response.saved[0]);
      }
    });
  }

  showEdit(obj) {
    if (!obj) return false;

    this.currentGroupEdit = obj;
    this.formEdit.name = obj.name;
    this.formEdit.description = obj.description;

    this.controlsGroup.edit = true;
  }

  edit() {
    if (!this.currentGroupEdit) return false;

    this.currentGroupEdit.name = this.formEdit.name;
    this.currentGroupEdit.description = this.formEdit.description;
    this.currentGroupEdit.words = "";

    this.groupService.updateGroup(this.currentGroupEdit).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        const group = this.data.find(d => d._id === response.saved[0]._id);

        if (group) {
          group.name = response.saved[0].name;
          group.description = response.saved[0].description;
        }
        this.controlsGroup.edit = false;

        this.formEdit.name = "";
        this.formEdit.description = "";
        this.currentGroupEdit = null;
      }
    });
  }

  filter() {

  }

  searchGroup() {
    let request = new Request();
    const queryRequest = this.strSearchGroup.queryRequest();
    for (const item in queryRequest) {
      request[item] = queryRequest[item];
    }

    this.groupService.getGroups(request).subscribe((response: Group[]) => {
      if (response && response.length) {
        this.data = response;

        this.controlsGroup.search = false;
      }
    });
  }

  searchWord() {
    let request = new Request();
    const queryRequest = this.strSearchGroup.queryRequest();
    for (const item in queryRequest) {
      request[item] = queryRequest[item];
    }

    this.wordService.getWords(request).subscribe((response: Word[]) => {
      if (response && response.length) {
        this.dataWord = response;

        this.controlsWordMap.search = false;
      }
    });
  }

  map() {
    const wordSelected = this.dataWord.filter(word => word.selected);
    const activeGroup = this.data.find(d => d.selected);
    if (!activeGroup || !activeGroup._id || wordSelected.length <= 0) return false;

    var data = {
      _id: this.activeGroup._id,
      words: wordSelected.map(group => group._id)
    }

    this.wordService.linkGroup(data).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        this.ngOnInit();
      }
    });
  }

  more() {

  }

  delete(obj) {
    if (!obj) return false;

    const result = confirm("Are you sure!");
    if (result) {
      this.groupService.deleteGroup(obj._id).subscribe((response: ResultResponse) => {
        if (response && response.error.length > 0) {
          console.error(response.error);
          alert("something error!");
        }

        if (response && response.saved.length > 0) {
          this.data = this.data.filter(group => group._id !== obj._id);
        }
      });
    }
  }

  select(obj) {
    obj.selected = !obj.selected;

    if (obj.selected) {
      if (obj.words && obj.words instanceof Array) { // Check obj instance of Group
        this.activeGroup = obj;
      }
    } else {
      this.activeGroup = new Group();
    }
  }

  toggleAdd(value: boolean) {
    this.controlsGroup.add = value;

    // if(value) {
    //   this.inputName.first.nativeElement.focus();
    // }
  }

  toggleCheckAllGroup(value: boolean) {
    this.controlsGroup.checkAll = value;
    this.data.map(group => group.selected = value);
  }

  toggleCheckAllWord(value: boolean) {
    this.controlsWord.checkAll = value;

    const group = this.data.find(group => group._id === this.activeGroup._id);

    if (group && group.words instanceof Array) {
      group.words.map((word: Word) => word.selected = value);
    }
  }

  toggleCheckAllWordMap(value: boolean) {
    this.controlsWordMap.checkAll = value;
    this.dataWord.map(word => word.selected = value);
  }

  goBack(): void {
    this.location.back();
  }

}
