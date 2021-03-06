import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Group } from './group';
import { Request } from './request';
import { Word } from './word';
import { ResultResponse } from './resultResponse';

import { MessageService } from './message.service';
import { LocalStorageService } from './local-storage.service';

import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const fieldLocalStorage = "groups";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupUrl = environment.groupUrl;  // URL to web api
  private wordUrl = environment.wordUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }

  /** GET Group from the server */
  gets(request: Request = null): Observable<Group[]> {
    const param = request.paramsUrl();
    const url = param ? `${this.groupUrl}?${param}` : this.groupUrl;

    // Load data from cache if cache setting enabled
    // if (this.localStorageService.cacheLocal()) {
    //   const localData = this.localStorageService.get(fieldLocalStorage);
    //   if (localData) {
    //     return JSON.parse(localData);
    //   }
    // }

    return this.http.get<Group[]>(url)
      .pipe(
        tap(_ => {
          // if (this.localStorageService.cacheLocal()) {
          //   this.localStorageService.set(fieldLocalStorage, _);
          // }
          this.log('fetched groups');
        }),
        catchError(this.handleError('getGroups', []))
      );
  }

  /** GET group by id. Will 404 if id not found */
  get(id: string): Observable<Group[]> {
    const url = `${this.groupUrl}/?id=${id}`;
    return this.http.get<Group[]>(url).pipe(
      tap(_ => this.log(`fetched group`)),
      catchError(this.handleError<Group[]>(`getGroup`))
    );
  }

  /* GET groups whose name contains search term */
  search(term: string): Observable<Group[]> {
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

  link(data): Observable<any> {
    return this.http.put<any>(this.groupUrl + "/linkword", data, httpOptions).pipe(
      tap(_ => this.log(`word linkWord`)),
      catchError(this.handleError<any>('linkWord'))
    );
  }

  /** POST: add a new group to the server */
  add(group: Group): Observable<ResultResponse> {
    return this.http.post<ResultResponse>(this.groupUrl, group, httpOptions).pipe(
      tap((response: ResultResponse) => this.log(`added group w/ groups: ${response.saved.map((group: Group) => group.name).join(', ')}`)),
      catchError(this.handleError<ResultResponse>('addGroup'))
    );
  }

  /** DELETE: delete the group from the server */
  delete(group: Group | string): Observable<ResultResponse> {
    const id = typeof group === 'string' ? group : group._id;

    const option = {
      headers: httpOptions.headers,
      body: {
        _id: id
      }
    };

    return this.http.delete<ResultResponse>(this.groupUrl, option).pipe(
      tap(_ => this.log(`deleted group id=${id}`)),
      catchError(this.handleError<ResultResponse>('deleteGroup'))
    );
  }

  /** PUT: update the group on the server */
  update(group: Group): Observable<any> {
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
  private handleError<T>(operation = 'operation', result?: T) {
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
