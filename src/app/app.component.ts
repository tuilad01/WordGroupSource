import { Component } from '@angular/core';

import { Router, ActivatedRoute } from "@angular/router";

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

  constructor(private router: Router) {
    this.router.events.subscribe((route: any) => {
      if (route.url) {
        this.url = route.url;
      }
    });
  }

  ngOnInit() {  
  }

  showNav() {
    if (this.arrUrlPreventShownNav.indexOf(this.url) === -1){
      return true;
    }
    return false;
  }
}
