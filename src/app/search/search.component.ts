import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query = "";
  url_group = environment.baseUrl + "/group";

  data = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {    

  }

  search(event) {

    const request = event.target.value ? `name=${event.target.value.trim()}` : "";

    this.getGroups(request).subscribe(groups => {
      this.data = groups.map(group => {
        return {
          id: group._id,
          name: group.name,
          description: group.description,
        }
      })
    });
  }

  getGroups(request = ""): Observable<any[]> {
    
    const  url = request ? `${this.url_group}?${request}` : this.url_group;    

    return this.http.get<any[]>(url)
      .pipe(
        tap(groups => this.log(`fetched Groups`)),
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
