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
  title = "Group";

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
  }

  formAdd = {
    name: "",
    option: ""
  }

  formEdit = {
    name: "",
    option: ""
  }

  strSearchPrimaryList = "";
  strSearchMapList = "";

  currentEditModel: Word;

  data: Group[] = [];

  activeModel: Group;

  dataMap: Word[] = [];

  public fieldArrPrimary = "words";
  public fieldArrSecond = "groups";
  public fieldOptionPrimary = "description";
  public fieldOptionSecond = "mean";

  constructor(
    private location: Location,
    private primaryService: GroupService,
    private secondService: WordService
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

  private createModel (id = "", name = "", description = "", words?): Group {
    const group = new Group();
    group._id = id;
    group.name = name;
    group.description = description;
    group.words = words;
    return group;
  }

  private createDataLink(_id, words): any {
    return {
      _id: _id,
      words: words
    };
  }

  private parsePrimaryModel(obj: any): Group {
    return obj as Group;
  }

  private parseSecondModel(obj: any): Word {
    return obj as Word;
  }

  add() {
    if (!this.formAdd.name) return;

    const model = this.createModel("", this.formAdd.name, this.formAdd.option, "");

    this.primaryService.add(model).subscribe((response: ResultResponse) => {

      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
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

  showEdit(obj) {
    if (!obj) return false;

    this.currentEditModel = obj;
    this.formEdit.name = obj.name;
    this.formEdit.option = obj[this.fieldOptionPrimary];

    this.controlPrimaryList.edit = true;
  }

  edit() {
    if (!this.currentEditModel) return false;

    const model = this.createModel(this.currentEditModel._id, this.formEdit.name, this.formEdit.option, "");

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
    debugger
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

        this.controlPrimaryList.map = false;
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

  selectPrimaryList (obj: Group) {
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
  }

  goBack(): void {
    this.location.back();
  }

}
