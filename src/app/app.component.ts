import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { LocalStorageService } from './local-storage.service';
import { WordService } from './word.service';
import { environment } from './../environments/environment';
import { Request } from './request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  arrUrlPreventShownNav = [
    "/group",
    "/word",
    "/setting"
  ];

  url: string;

  countWord = 0;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private wordService: WordService
    ) {
    this.router.events.subscribe((route: any) => {
      if (route.url) {
        this.url = route.url;
      }
    });
  }

  ngOnInit() {
    const wordLocal = this.localStorageService.get(environment.settings.wordLocal);
    if (wordLocal) {
      const arrWordLocal = JSON.parse(wordLocal);
      if (arrWordLocal && arrWordLocal.length) {
        this.countWord = arrWordLocal.length;
      }      
    } else {
      const request = new Request();
      this.wordService.gets(request).subscribe(words => {
        if(words && words.length) {
          this.countWord = words.length;
        }
      });
    }

  }

  showNav() {
    if (this.arrUrlPreventShownNav.indexOf(this.url) === -1){
      return true;
    }
    return false;
  }
}
