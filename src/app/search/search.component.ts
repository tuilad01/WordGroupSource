import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GroupService } from './../group.service';

import { Request } from './../request';
import { LocalStorageService } from './../local-storage.service';
import { DataService } from './../data.service';
import { Group } from '../group';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query = "";
  numberWord = 0;
  url_group = environment.baseUrl + "/group";

  data = [];

  private fieldLocalStorageGroup = environment.settings.groupLocal;

  constructor(
    private http: HttpClient,
    private router: Router,
    private groupService: GroupService,
    private localStorageService: LocalStorageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    // this.dataService.currentMessage.subscribe(message => this.message = message);
    this.data = this.localStorageService.getArray(this.fieldLocalStorageGroup).map(d => {
      d["selected"] = false;
      return d;
    });
  }

  next(event) {
    event.preventDefault();

    if (this.numberWord <= 0) {
      return false;
    }

    const selectedGroups = this.data.filter(d => d.selected);

    const gr = new Group();
    gr.name = selectedGroups.map(d => d.name).join(" + ");
    gr.description = selectedGroups.map(d => d.description).join(" + ");
    const words = [].concat.apply([], selectedGroups.map(d => d.words));

    if (words instanceof Array) {
      const arr = Array.from(new Set(words.map(d => d._id)))
        .map(id => {
          return words.find(dd => dd._id === id);
        });

      gr.words = arr;
    }

    this.dataService.changeGroup(gr);
    this.router.navigate(['/learn']);
  }


  search(event) {
    const request = new Request();
    request.name = event.target.value ? event.target.value.trim() : "";

    if (this.localStorageService.cacheLocal()) {
      if (this.localStorageService.get(this.fieldLocalStorageGroup)) {
        const groups = this.localStorageService.getArray(this.fieldLocalStorageGroup);
        if (request.name) {
          this.data = groups.filter(d => {
            const regex = new RegExp(request.name, "gi");
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

  select(obj) {
    obj.selected = !obj.selected;

    this.numberWord = this.data.filter(d => d.selected).map(d => d.words.length).reduce((total, num) => {
      return total + num;
    }, 0);
  }
}
