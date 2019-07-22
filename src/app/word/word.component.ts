import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

import { WordService } from "./../word.service";
import { GroupService } from "./../group.service";

import { Word } from "./../word";
import { Group } from '../group';
import { Request } from '../request';
import { ResultResponse } from '../resultResponse';

import './../extentions';
import { group } from '@angular/animations';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  // @ViewChildren("textBoxName") inputName;
  title = "Word";

  controlPrimaryList = {
    add: false,
    search: false,
    map: false,
    edit: false,
    more: false,
    checkAll: false
  }

  controlSecondList = {
    search: false,
    checkAll: false,
    numberSelected: 0
  }

  controlMapList = {
    search: true,
    checkAll: false,
    numberSelected: 0
  }

  formAdd = {
    name: "",
    option: ""
  }

  formEdit = {
    name: "",
    option: "",
    array: ""
  }

  strSearchPrimaryList = "";
  strSearchMapList = "";

  currentEditModel: Word;

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
  ];

  activeModel: Word;

  dataMap: Group[] = [];

  public fieldArrPrimary = "groups";
  public fieldArrSecond = "words";
  public fieldOptionPrimary = "mean";
  public fieldOptionSecond = "description";

  constructor(
    private location: Location,
    private primaryService: WordService,
    private secondService: GroupService
  ) { }

  ngOnInit() {
    const request = new Request();
    request.page = 0;
    request.limit = 10;
    this.primaryService.gets(request).subscribe(response => {
      if (response && response.length) {
        this.data = response;
      }
    });
  }

  private createModel (id = "", name = "", mean = "", groups?): Word {
    const word = new Word();
    word._id = id;
    word.name = name;
    word.mean = mean;
    word.groups = groups;
    return word;
  }

  private createDataLink(_id, groups): any {
    return {
      _id: _id,
      groups: groups
    };
  }

  private parsePrimaryModel(obj: any): Word {
    return obj as Word;
  }

  private parseSecondModel(obj: any): Group {
    return obj as Group;
  }

  add() {
    if (!this.formAdd.name) return;

    const model = this.createModel("", this.formAdd.name, this.formAdd.option, "");

    this.primaryService.add(model).subscribe((response: ResultResponse) => {

      if (response && response.error.length > 0) {
        console.error(response.error);

        const arrError = this.handleError(response.error);
        if (arrError.length > 0) {
          alert("Something error!!! may be can't insert: " + arrError.join(", "));
        } else {
          alert("Something error!!!")
        }
        
      }

      if (response && response.saved.length > 0) {
        this.controlPrimaryList.add = false;

        this.formAdd.name = "";
        this.formAdd.option = "";

        response.saved.map(d => {
          this.data.unshift(d);
        });
      }
    });
  }
  handleError(errors) {
    let resultError = [];
    const regex = /\{\s\:\s\"(.+?)\"\s\}/gi;
    for (let i = 0; i < errors.length; i++) {
      debugger;
        const err = errors[i];
        const field = regex.exec(err)[1];
        regex.lastIndex = 0;
        if (!field) continue;

        resultError.push(field);
    }
    return resultError;
}

  showEdit(obj) {
    if (!obj) return false;

    this.currentEditModel = obj;
    this.formEdit.name = obj.name;
    this.formEdit.option = obj[this.fieldOptionPrimary];
    if (obj[this.fieldArrPrimary].length > 0) {
      const array = obj[this.fieldArrPrimary].map(d => d._id).join(",");
      this.formEdit.array = array;
    }

    this.controlPrimaryList.edit = true;
  }

  edit() {
    if (!this.currentEditModel) return false;

    const model = this.createModel(this.currentEditModel._id, this.formEdit.name, this.formEdit.option, this.formEdit.array);

    this.primaryService.update(model).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        let modelEdit = this.data.find(d => d._id === response.saved[0]._id);

        if (modelEdit) {
          modelEdit.name = response.saved[0].name;
          modelEdit[this.fieldOptionPrimary] = response.saved[0][this.fieldOptionPrimary];
        }
        this.controlPrimaryList.edit = false;

        this.formEdit.name = "";
        this.formEdit.option = "";
        this.currentEditModel = null;
      }
    });
  }

  click_exclude(obj) {
    this.exclude(this.activeModel, obj);
  }

  click_excludes() {
    const result = confirm("Are you sure?");
    if (!result) return false;

    if(this.activeModel[this.fieldArrPrimary] instanceof Array) {
      const element = this.activeModel[this.fieldArrPrimary];
      const arr = element.filter(d => d.selected);
      this.exclude(this.activeModel, arr);
    }
  }

  exclude(active: Object, model: Object | Array<any>) {
    if (!active) return; 

    if (active[this.fieldArrPrimary] instanceof Array) {
      const element = active[this.fieldArrPrimary];
      let arrNew = [];
      if (model instanceof Array) {
        const arrGroup = model.map(d => d._id);
        arrNew = element.filter(d => arrGroup.indexOf(d._id) === -1);
      } else {
        arrNew = element.filter(d => d._id !== model["_id"]);
      }    

      const modelEdit = { ...active };
      modelEdit[this.fieldArrPrimary] = arrNew.map(d => d._id).join(",");
      

      this.primaryService.update(this.parsePrimaryModel(modelEdit)).subscribe(response => {
        if (response && response.error.length > 0) {
          console.error(response.error);
          alert("something error!");
        }
  
        if (response && response.saved.length > 0) {
          const rsModel = this.data.find(d => d._id === response.saved[0]._id);
  
          if (rsModel) {
            rsModel[this.fieldArrPrimary] = arrNew;
            this.activeModel[this.fieldArrPrimary] = arrNew;
          }
        }
      });
    }
  }

  filter() {

  }

  searchPrimaryList() {
    let request = new Request();
    const queryRequest = this.strSearchPrimaryList.queryRequest();
    for (const item in queryRequest) {
      request[item] = queryRequest[item];
    }

    this.primaryService.gets(request).subscribe(response => {
      if (response && response.length) {
        this.data = response;

        this.controlPrimaryList.search = false;
      }
    });
  }

  searchMapList() {
    let request = new Request();
    const queryRequest = this.strSearchMapList.queryRequest();
    for (const item in queryRequest) {
      request[item] = queryRequest[item];
    }


    this.secondService.gets(request).subscribe((response: Group[]) => {
      if (response && response.length) {
        this.dataMap = response;

        this.controlMapList.search = false;
      }
    });
  }

  map() {
    const modelMapSelected = this.dataMap.filter(d => d.selected);
    if (!this.activeModel || !this.activeModel._id || modelMapSelected.length <= 0) return false;

    const data = this.createDataLink(this.activeModel._id, modelMapSelected.map(d => d._id))

    this.secondService.link(data).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {

        //this.controlPrimaryList.map = false;
        this.controlPrimaryList.more = true;
        this.controlMapList.checkAll = false;
        this.dataMap.map(d => d.selected = false);

        const resModel = response.saved[0];

        if (resModel) {
          this.primaryService.get(resModel._id).subscribe(response => {
            if (response[0]) {
              let itemData = this.data.find(d => d._id === response[0]._id);
              if (itemData) {
                itemData[this.fieldArrPrimary] = response[0][this.fieldArrPrimary];
              }
            }
          });
          this.searchMapList();
        }
      }
    });
  }

  delete(obj) {
    if (!obj) return false;

    const result = confirm("Are you sure!");
    if (result) {
      this.primaryService.delete(obj._id).subscribe((response: ResultResponse) => {
        if (response && response.error.length > 0) {
          console.error(response.error);
          alert("something error!");
        }

        if (response && response.saved.length > 0) {
          this.data = this.data.filter(d => d._id !== obj._id);
        }
      });
    }
  }

  selectPrimaryList (obj: Word) {
    obj.selected = !obj.selected;
    if (obj.selected) {
        this.activeModel = obj;      
    } else {
      this.activeModel = this.createModel("", "", "", []);
    }
  }

  selectSecondList(obj: Word) { 
    obj.selected = !obj.selected;
    if (this.activeModel[this.fieldArrPrimary] instanceof Array) {
      this.controlSecondList.numberSelected = this.activeModel[this.fieldArrPrimary].filter(d => d.selected).length;
    }
  }

  selectMapList(obj: Word) {
    obj.selected = !obj.selected;
    this.controlMapList.numberSelected = this.dataMap.filter(d => d.selected).length;
  }

  toggleAdd(value: boolean) {
    this.controlPrimaryList.add = value;

    // if(value) {
    //   this.inputName.first.nativeElement.focus();
    // }
  }

  toggleCheckAllPrimaryList(value: boolean) {
    this.controlPrimaryList.checkAll = value;
    this.data.map(d => d.selected = value);
  }

  toggleCheckAllSecondList(value: boolean) {
    this.controlSecondList.checkAll = value;

    const model = this.data.find(d => d._id === this.activeModel._id);

    if (model[this.fieldArrPrimary] instanceof Array) {
      model[this.fieldArrPrimary].map(d => d.selected = value);
      this.controlSecondList.numberSelected = model[this.fieldArrPrimary].filter(d => d.selected).length;     
    }
  }

  toggleCheckAllMapList(value: boolean) {
    this.controlMapList.checkAll = value;
    this.dataMap.map(d => d.selected = value);
    this.controlMapList.numberSelected = this.dataMap.filter(d => d.selected).length;
  }

  goBack(): void {
    this.location.back();
  }

}
