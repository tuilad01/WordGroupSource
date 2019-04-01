import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-testanimation',
  templateUrl: './testanimation.component.html',
  styleUrls: ['./testanimation.component.css'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(180deg)',
          opacity: '0'
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
          opacity: '1'
        })
      ),
      transition('active => inactive', animate('400ms ease-out')),
      transition('inactive => active', animate('400ms ease-in')),
    ]),
  ]
})
export class TestanimationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  flip = true;

  toggleFlip() {
    this.flip = !this.flip;
  }


}
