import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from './../../environments/environment';

import { LocalStorageService } from './../local-storage.service';
import { GroupService } from './../group.service';
import { WordService } from './../word.service';

import { Request } from './../request';
import { ResultResponse } from './../resultResponse';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  title = "Setting";
  
  system = {
    box1: "SYSTEMBOX1",
    box2: "SYSTEMBOX2",
    box3: "SYSTEMBOX3",
  }

  
  settings = {
    cacheLocal: {
      name: environment.settings.cacheLocal,
      value: false
    },
    groupLocal: {
      name: environment.settings.groupLocal,
      value: []
    },
    wordLocal: {
      name: environment.settings.wordLocal,
      value: []
    }
  }

  isInsertNewWordSystemBox1 = false;

  constructor(
    private location: Location,
    private localStorageService: LocalStorageService,
    private groupService: GroupService,
    private wordService: WordService
  ) { }

  ngOnInit() {
    const cacheLocalValue = this.localStorageService.get(this.settings.cacheLocal.name);
    if(cacheLocalValue) {
      this.settings.cacheLocal.value = cacheLocalValue;
    }
  }
  
  change() {
    if (this.settings.cacheLocal.value) {
      const request = new Request();
      this.groupService.gets(request).subscribe(groups => this.localStorageService.set(this.settings.groupLocal.name, groups));
      this.wordService.gets(request).subscribe(words => this.localStorageService.set(this.settings.wordLocal.name, words));

      this.localStorageService.set(this.settings.cacheLocal.name, this.settings.cacheLocal.value);
    } else {
      this.localStorageService.clear();
    }
  }
  
  insertNewWordSystemBox1() {
    if (!this.isInsertNewWordSystemBox1 || !this.settings.cacheLocal.value) return false;

    const groups = this.localStorageService.getArray(this.settings.groupLocal.name);
    const words = this.localStorageService.getArray(this.settings.wordLocal.name);

    const systemBox1 = groups.find(d => d.name === this.system.box1);
    
    if (systemBox1.words.length === words.length) return false;

    const systemBox2 = groups.find(d => d.name === this.system.box2);
    const systemBox3 = groups.find(d => d.name === this.system.box3);

    const mergeSysBox23 = Array.from(new Set([...systemBox2.words, ...systemBox3.words]));

    const arrAppendWord = words.filter(word => mergeSysBox23.indexOf(word._id) === -1).map(word => word._id);

    const data = {
      _id: systemBox1._id,
      words: arrAppendWord
    }

    this.wordService.link(data).subscribe((response: ResultResponse) => {
      if (response && response.error.length > 0) {
        console.error(response.error);
        alert("something error!");
      }

      if (response && response.saved.length > 0) {
        this.change();
        this.isInsertNewWordSystemBox1 = true;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
