import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

import { WordService } from "./../word.service";
import { GroupService } from "./../group.service";

import { Word } from "./../word";
import { Group } from '../group';
import { Request } from '../request';
import { ResultResponse } from '../resultResponse';
import { query } from '@angular/core/src/render3';


@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  // @ViewChildren("textBoxName") inputName;

  controlsWord = {
    add: false,
    search: false,
    map: false,
    edit: false,
    more: false,
    checkAll: false
  }

  controlsGroup = {
    search: false,
    checkAll: false
  }

  controlsGroupMap = {
    search: true,
    checkAll: false,
  }

  formAdd = {
    name: "",
    mean: ""
  }

  formEdit = {
    name: "",
    mean: ""
  }

  strSearchWord = "";
  strSearchGroup = "";

  currentWordEdit: Word;

  data: Word[] = [
    {
      _id: "1",
      name: "Voluptate 1",
      mean: "Aliqua Dolore minim ea sit ex duis labore sunt tempor.",
      groups: [
        {
          _id: "1",
          name: "Ex adipisicing 1",
          description: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "2",
          name: "Ex adipisicing 2",
          description: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "3",
          name: "Ex adipisicing 3",
          description: "Sint eu esse eu exercitation fugiat."
        },
        {
          _id: "4",
          name: "Ex adipisicing 4",
          description: "Sint eu esse eu exercitation fugiat."
        },

      ],
      selected: false
    },
    {
      _id: "2",
      name: "Voluptate 2",
      mean: "Aliqua",
      groups: [],
      selected: false
    },
    {
      _id: "3",
      name: "Voluptate 3",
      mean: "Aliqua",
      groups: [],
      selected: false
    },
    {
      _id: "4",
      name: "Voluptate 4",
      mean: "Aliqua",
      groups: [],
      selected: false
    }
    // ,
    // {
    //   _id: "5",
    //   name: "Voluptate 5",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "6",
    //   name: "Voluptate 6",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "7",
    //   name: "Voluptate 7",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "8",
    //   name: "Voluptate 8",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "9",
    //   name: "Voluptate 9",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "10",
    //   name: "Voluptate 10",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "11",
    //   name: "Voluptate 11",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "12",
    //   name: "Voluptate 12",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "13",
    //   name: "Voluptate 13",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "14",
    //   name: "Voluptate 14",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "15",
    //   name: "Voluptate 15",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "16",
    //   name: "Voluptate 16",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },
    // {
    //   _id: "17",
    //   name: "Voluptate 17",
    //   mean: "Aliqua",
    //   groups: [],
    //   selected: false
    // },

  ];

  activeWord: Word;

  dataGroup: Group[] = [];


  constructor(
    private location: Location,
    private wordService: WordService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    const request = new Request();
    request.page = 0;
    request.limit = 10;
    this.wordService.getWords(request).subscribe((response: Word[]) => {
      if (response && response.length) {
        this.data =  response;
      }
    });
  }

  add() {
    if (!this.formAdd.name) return;

    const newWord = new Word();
    newWord.name = this.formAdd.name;
    newWord.mean = this.formAdd.mean;

    this.wordService.addWord(newWord).subscribe((response: ResultResponse) => {
      
      if(response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        this.controlsWord.add = false;

        this.data.unshift(response.saved[0]);
      }
    });
  }

  showEdit(obj) {
    if (!obj) return false;

    this.currentWordEdit = obj;
    this.formEdit.name = obj.name;
    this.formEdit.mean = obj.mean;

    this.controlsWord.edit = true;
  }

  edit() {
    if(!this.currentWordEdit) return false;

    this.currentWordEdit.name = this.formEdit.name;
    this.currentWordEdit.mean = this.formEdit.mean;
    this.currentWordEdit.groups = "";

    this.wordService.updateWord(this.currentWordEdit).subscribe((response: ResultResponse) => {
      if(response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        const word = this.data.find(d => d._id === response.saved[0]._id);
        
        if(word) {
          word.name = response.saved[0].name;
          word.mean = response.saved[0].mean;
        }
        this.controlsWord.edit = false;

        this.formEdit.name = "";
        this.formEdit.mean = "";
        this.currentWordEdit = null;
      }
    });
  }

  filter() {

  }

  private queryWord(string): Request {    
    const request = new Request();
    const query = string.trim();

    const regex_getDate = /\[date:(.+?)\]/gi
    const regex_getDateForm = /\[datefrom:(.+?)\]/gi
    const regex_getDateTo = /\[dateto:(.+?)\]/gi
    const regex_getName = /\[name:(.+?)\]/gi
    const regex_getNotInGroup = /\[notingroup\]/gi
    const regex_query = /[\s](.+)(?!\[.+?\])/gi

    if(!query) {
      return request;
    }

    const date = regex_getDate.exec(query);

    if(date && date[1]) {
      // var now = new Date();
      // var today 

      // switch(date[1].toLowerCase()) {
      //   case "today": 
      //   request.fromDate = 
      //   request.toDate = dateTo[1];
      //   break;
      // }
    }

    const dateForm = regex_getDateForm.exec(query);

    if(dateForm && dateForm[1]) {
      request.fromDate = dateForm[1];
    }

    const dateTo = regex_getDateTo.exec(query);

    if(dateTo && dateTo[1]) {
      request.toDate = dateTo[1];
    }

    const name = regex_query.exec(query);

    if(name && name.input) {
      request.name = name.input;
    }

    const groupname = regex_getName.exec(query);

    if(groupname && groupname[1]) {
      request.childName = "groupname";
      request.childValue = groupname[1];
    }

    const notInGroup = regex_getNotInGroup.exec(query);

    if(notInGroup && notInGroup[1]) {

    }

    
    return request;
  }

  searchWord() {
    const request = this.queryWord(this.strSearchWord);

    this.wordService.getWords(request).subscribe((response: Word[]) => {
      if (response && response.length) {
        this.data =  response;

        this.controlsWord.search = false;
      }
    });
  }

  private queryGroup(string): Request {    
    const request = new Request();
    const query = string.trim();

    const regex_getDate = /\[date:(.+?)\]/gi
    const regex_getDateForm = /\[datefrom:(.+?)\]/gi
    const regex_getDateTo = /\[dateto:(.+?)\]/gi
    const regex_getName = /\[name:(.+?)\]/gi
    const regex_getNotInGroup = /\[notingroup\]/gi
    const regex_query = /[\s](.+)(?!\[.+?\])/gi

    if(!query) {
      return request;
    }

    const date = regex_getDate.exec(query);

    if(date && date[1]) {
      // var now = new Date();
      // var today 

      // switch(date[1].toLowerCase()) {
      //   case "today": 
      //   request.fromDate = 
      //   request.toDate = dateTo[1];
      //   break;
      // }
    }

    const dateForm = regex_getDateForm.exec(query);

    if(dateForm && dateForm[1]) {
      request.fromDate = dateForm[1];
    }

    const dateTo = regex_getDateTo.exec(query);

    if(dateTo && dateTo[1]) {
      request.toDate = dateTo[1];
    }

    const name = regex_query.exec(query);

    if(name && name.input) {
      request.name = name.input;
    }

    const wordname = regex_getName.exec(query);

    if(wordname && wordname[1]) {
      request.childName = "wordname";
      request.childValue = wordname[1];
    }

    const notInGroup = regex_getNotInGroup.exec(query);

    if(notInGroup && notInGroup[1]) {

    }

    
    return request;
  }


  searchGroup() {
    const request = this.queryGroup(this.strSearchGroup);

    this.groupService.getGroups(request).subscribe((response: Group[]) => {
      if (response && response.length) {
        this.dataGroup =  response;

        this.controlsGroupMap.search = false;
      }
    });
  }

  map() {
    const groupSelected = this.dataGroup.filter(group => group.selected);
    const activeWord = this.data.find(d => d.selected);
    if (!activeWord || !activeWord._id || groupSelected.length <= 0) return false;

    var data = {
      _id: this.activeWord._id,
      groups: groupSelected.map(group => group._id)
    }
    
    this.groupService.linkWord(data).subscribe((response: ResultResponse) => {
      if(response && response.error.length > 0) {
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
    if(!obj) return false;

    const result = confirm("Are you sure!");
    if ( result ) {
      this.wordService.deleteWord(obj._id).subscribe((response: ResultResponse) => {
        if(response && response.error.length > 0) {
          console.error(response.error);
          alert("something error!");
        }
  
        if (response && response.saved.length > 0) {  
          this.data = this.data.filter(word => word._id !== obj._id);
        }
      });
    }
  }

  select(obj) {
    obj.selected = !obj.selected;

    if (obj.selected) {      
      if (obj.groups && obj.groups instanceof Array) { // Check obj instance of Word
        this.activeWord = obj;
      }
    } else {
      this.activeWord = new Word();
    }
  }
 
  toggleAdd(value: boolean) {
    this.controlsWord.add = value;

    // if(value) {
    //   this.inputName.first.nativeElement.focus();
    // }
  }

  toggleCheckAllWord(value: boolean) {
    this.controlsWord.checkAll = value;
    this.data.map(word => word.selected = value);
  }

  toggleCheckAllGroup(value: boolean) {
    this.controlsGroup.checkAll = value;

    const word = this.data.find(word => word._id === this.activeWord._id);

    if (word && word.groups instanceof Array) {
      word.groups.map((group: Group) => group.selected = value);
    }
  }

  toggleCheckAllGroupMap(value: boolean) {
    this.controlsGroupMap.checkAll = value;
    this.dataGroup.map(group => group.selected = value);
  }

  goBack(): void {
    this.location.back();
  }

}
