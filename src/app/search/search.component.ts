import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { GroupService } from './../group.service';

import { Request } from './../request';
import { LocalStorageService } from './../local-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query = "";
  url_group = environment.baseUrl + "/group";

  data = [];

  private fieldLocalStorageGroup = "groups";

  constructor(
    private http: HttpClient,
    private groupService: GroupService,
    private localStorageService: LocalStorageService
    ) { }

  ngOnInit() {    

  }

  search(event) {
    const request = new Request();
    request.name = event.target.value ? event.target.value.trim() : "";   

    if (this.localStorageService.cacheLocal()) {
      if(this.localStorageService.get(this.fieldLocalStorageGroup)) {
        const groups = this.localStorageService.getArray(this.fieldLocalStorageGroup);   
        if (request.name) {
          this.data = groups.filter(d => {
            const regex = new RegExp(request.name,"gi");
            return d.name.match(regex);
          });
        } else {
          this.data = groups;
        }        
      } else {
        this.groupService.gets(request).subscribe(response => {
          if (response && response.length) {
            this.data = response;
          }
        });
      }         
    } else {
      this.groupService.gets(request).subscribe(response => {
        if (response && response.length) {
          this.data = response;
        }
      });
    }

    
  }
}
