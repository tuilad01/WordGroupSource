import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from './../../environments/environment';

import { LocalStorageService } from './../local-storage.service';
import { GroupService } from './../group.service';
import { WordService } from './../word.service';

import { Request } from './../request';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  title = "Setting";
  
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
  

  goBack(): void {
    this.location.back();
  }
}
