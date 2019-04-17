import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Group } from './group';
import { Word } from './word';
import { ResultResponse } from './resultResponse';

import { MessageService } from './message.service';

import { environment } from './../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupUrl = environment.groupUrl;  // URL to web api
  private wordUrl = environment.wordUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** GET Group from the server */
  getGroups (): Observable<Group[]> {
    return this.http.get<Group[]>(this.groupUrl)
      .pipe(
        tap(groups => this.log('fetched groups')),
        catchError(this.handleError('getGroups', []))
      );
  }

  /** GET group by id. Will 404 if id not found */
  getGroup(id: string): Observable<Group> {
    const url = `${this.groupUrl}/?id=${id}`;
    return this.http.get<Group>(url).pipe(
      tap(_ => this.log(`fetched group id=${id}`)),
      catchError(this.handleError<Group>(`getGroup id=${id}`))
    );
  }

  /* GET groups whose name contains search term */
  searchGroups(term: string): Observable<Group[]> {
    if (!term.trim()) {
      // if not search term, return empty group array.
      return of([]);
    }    
    return this.http.get<Group[]>(`${this.groupUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found groups matching "${term}"`)),
      catchError(this.handleError<Group[]>('searchGroups', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new group to the server */
  addGroup (group: Group): Observable<ResultResponse> {
    return this.http.post<ResultResponse>(this.groupUrl, group, httpOptions).pipe(
      tap((response: ResultResponse) => this.log(`added group w/ groups: ${response.saved.map((group: Group) => group.name).join(', ')}`)),
      catchError(this.handleError<ResultResponse>('addGroup'))
    );
  }

  /** DELETE: delete the group from the server */
  deleteGroup (group: Group | string): Observable<Group> {
    const id = typeof group === 'string' ? group : group._id;
    const url = `${this.groupUrl}/?id=${id}`;

    return this.http.delete<Group>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted group id=${id}`)),
      catchError(this.handleError<Group>('deleteGroup'))
    );
  }

  /** PUT: update the group on the server */
  updateGroup (group: Group): Observable<any> {
    return this.http.put(this.groupUrl, group, httpOptions).pipe(
      tap(_ => this.log(`updated group id=${group._id}`)),
      catchError(this.handleError<any>('updateGroup'))
    );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a GroupService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`GroupService: ${message}`);
  }
}
