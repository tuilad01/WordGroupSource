import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from './../../environments/environment';

import { LocalStorageService } from './../local-storage.service';

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
    }
  }

  constructor(
    private location: Location,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const cacheLocalValue = this.localStorageService.get(this.settings.cacheLocal.name);
    if(cacheLocalValue) {
      this.settings.cacheLocal.value = cacheLocalValue;
    }
  }
  
  change() {
    if (this.settings.cacheLocal.value) {
      this.localStorageService.set(this.settings.cacheLocal.name, this.settings.cacheLocal.value);
    } else {
      this.localStorageService.clear();
    }
  }
  

  goBack(): void {
    this.location.back();
  }
}
