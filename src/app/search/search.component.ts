import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search = "";

  constructor() { }

  ngOnInit() {
    

  }

  log(value) {
    console.log(value);
  }
}
