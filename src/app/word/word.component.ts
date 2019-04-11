import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styles: [`
        @import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
    `],
  styleUrls: [
    '../../assets/fontawesome-5.0.13/web-fonts-with-css/css/fontawesome-all.min.css',
    './word.component.css'
  ]
})
export class WordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  

  }

}
