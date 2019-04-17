import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { group } from '@angular/animations';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getGroups().subscribe(groups => {
      this.dataGroups = groups.map(grp => {
        return {
          _id: grp._id,
          name: grp.name,
          description: grp.description,
          words: grp.words,
          selected: false
        };
      })
    });
    this.getWords().subscribe(words => {
      this.dataWords = words.map(wrd => {
        return {
            _id: wrd._id,
           name: wrd.name,
           meam: wrd.mean,
           groups: wrd.groups,
           selected: false
        };
      });
      console.log(this.dataWords);
      return this.dataWords;
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

    this.addGroup().subscribe(group => {
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

    this.linkGroup(data).subscribe(response => {
      if(response.error.length > 0) {
        return alert("Error");
      }
      

    })
  }

  linkGroup(data) : Observable<any> {
    return this.http.put<any>(this.url_word + "/linkgroup", data, httpOptions).pipe(
      tap(group => this.log(`group linkGroup`)),
      catchError(this.handleError<any>('linkGroup'))
    );
  }

  addGroup(): Observable<any> {
    return this.http.post<any>(this.url_group, this.group, httpOptions).pipe(
      tap(group => group.saved.map(gr => this.log(`added group w/ id=${gr._id}`))),
      catchError(this.handleError<any>('addGroup'))
    );
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url_group}`)
      .pipe(
        tap(group => this.log(`get Groups`)),
        catchError(this.handleError('getGroups', []))
      );
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
