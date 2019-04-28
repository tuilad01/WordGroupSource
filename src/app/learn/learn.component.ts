import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'scale(1.1) rotateY(180deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'scale(1.0) rotateY(0)',
        })
      ),
      transition('active => inactive', animate('400ms ease-out')),
      transition('inactive => active', animate('400ms ease-in')),
    ]),
  ]
})
export class LearnComponent implements OnInit {

  dataTemp = [];
  data = [];

  temp = "";

  tryFlipped = false;

  url_word = environment.baseUrl + "/word";
  url_group = environment.baseUrl + "/group";

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if(id) {
      this.getGroup(id).subscribe(group => {
        this.data = group[0]["words"].map(word => {
          return {
            id: word._id,
            name: word.name,
            mean: word.mean,
            display: true,
            flipped: false,
          }
        })
      });
    }    
  }

  getGroup(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url_group}?id=${id}`)
      .pipe(
        tap(group => this.log(`get Group by id`)),
        catchError(this.handleError('getGroup', []))
      );
  }

  getWords(): Observable<any[]> {
    return this.http.get<any[]>(this.url_word)
      .pipe(
        tap(word => this.log(`fetched Words`)),
        catchError(this.handleError('getWords', []))
      );
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  random() {
    return this.data = this.shuffle(this.data);
  }

  delete(indexWord) {
    const word = this.data.find((element, index) => {
      return index == indexWord;
    });
    return word.display = false;
  }

  reset() {
    const firstWord = this.data[0];
    const flipped = !firstWord.flipped;

    for (let i = 0; i < this.data.length; i++) {
      const word = this.data[i];
      word.display = true;
      word.flipped = flipped;
    }
  }

  save() {
    const data = [...this.data.map(word => {
      return {
        id: word.id,
        display: word.display
      };
    })]
    this.dataTemp = data;
  }

  dispose() {
    return this.dataTemp = [];
  }

  try() { 
    this.tryFlipped = !this.tryFlipped;
    for (let i = 0; i < this.dataTemp.length; i++) {
      const wordTemp = this.dataTemp[i];

      for (let j = 0; j < this.data.length; j++) {
        const word = this.data[j];

        if (word.id == wordTemp.id) {
          word.display = wordTemp.display;
          word.flipped = this.tryFlipped;
          break;
        }
      }

    }
  }

  flipped(id) {
    const word = this.data.find(word => word.id == id);
    word.flipped = !word.flipped;
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead


      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
