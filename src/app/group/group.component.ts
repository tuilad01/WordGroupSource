import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { group } from '@angular/animations';

import { GroupService } from './../group.service';
import { WordService } from './../word.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  group = {
    name: "",
    description: "",
    words: ""
  }

  search = {
    name: "",
    fromdate: "",
    todate: ""
  }

  controls = {
    add: false,
    search: false,
    map: false
  }

  url_word = environment.baseUrl + "/word";
  url_group = environment.baseUrl + "/group";

 

  dataWords = [];

  dataGroups = [];

  constructor(
    private http: HttpClient,
    private groupService: GroupService,
    private wordService: WordService
    ) { }

  ngOnInit() {
    this.groupService.getGroups().subscribe(groups => {
      this.dataGroups = groups;
    });
    this.wordService.getWords().subscribe(words => {
      this.dataWords = words;
    });
  }

  selectGroup (obj) {
    this.dataGroups.map(group => group.selected = false);
    obj.selected = true;
  }

  selectAll (event) {
    this.dataWords.map(word => word.selected = event.target.checked);
  }

  submitGroup () {
    if ( !group.name ) return false;

    this.groupService.addGroup(this.group).subscribe(group => {
      group.saved.map(gr => {
        if (gr) {
          this.dataGroups.push(gr);
        }
      })
    });;
  }

  mapping() {
    const group = this.dataGroups.find(group => group.selected === true);
    const words = this.dataWords.filter(word => word.selected === true);
 
    if ( !group || !group._id) {
      return false;
    }

    if ( !words || !words.length || words.length <= 0 ) {
      return false;
    }

    const data = {
      _id: group._id,
      words: words.map(wrd => wrd._id)
    }   
  } 
}
