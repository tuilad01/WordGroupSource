import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Word } from './word';
import { Request } from './request';
import { MessageService } from './message.service';
import { LocalStorageService } from './local-storage.service';

import { environment } from './../environments/environment';
import { ResultResponse } from './resultResponse';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const fieldLocalStorage = "words";

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private groupUrl = environment.groupUrl;  // URL to web api
  private wordUrl = environment.wordUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }

  /** GET words from the server */
  gets (request: Request = null): Observable<Word[]> {
    const param = request.paramsUrl();
    const url = param ? `${this.wordUrl}?${param}` : this.wordUrl;

    // Load data from cache if cache setting enabled
    // if (this.localStorageService.cacheLocal()) {
    //   const localData = this.localStorageService.get(fieldLocalStorage);
    //   if ( localData ) {
    //     return JSON.parse(localData);
    //   }
    // }

    return this.http.get<Word[]>(url)
      .pipe(
        tap(_ => {
          if (this.localStorageService.cacheLocal()) {
            this.localStorageService.set(fieldLocalStorage, _);
          }
          this.log('fetched words');
        }),
        catchError(this.handleError('getWords', []))
      );
  }

  /** GET word by id. Will 404 if id not found */
  get(id: string): Observable<Word[]> {
    const url = `${this.wordUrl}/?id=${id}`;
    return this.http.get<Word[]>(url).pipe(
      tap(_ => this.log(`fetched word id=${id}`)),
      catchError(this.handleError<Word[]>(`getWord id=${id}`))
    );
  }

  /* GET words whose name contains search term */
  search(term: string): Observable<Word[]> {
    if (!term.trim()) {
      // if not search term, return empty word array.
      return of([]);
    }
    return this.http.get<Word[]>(`${this.wordUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found words matching "${term}"`)),
      catchError(this.handleError<Word[]>('searchWords', []))
    );
  }

  //////// Save methods //////////

  link(data) : Observable<any> {
    return this.http.put<any>(this.wordUrl + "/linkgroup", data, httpOptions).pipe(
      tap(_ => this.log(`group linkGroup`)),
      catchError(this.handleError<any>('linkGroup'))
    );
  }

  /** POST: add a new word to the server */
  add (word: Word): Observable<ResultResponse> {
    return this.http.post<ResultResponse>(this.wordUrl, word, httpOptions).pipe(
      tap(_ => this.log(`added word`)),
      catchError(this.handleError<ResultResponse>('addWord'))
    );
  }

  /** DELETE: delete the word from the server */
  delete (word: Word | string): Observable<ResultResponse> {
    const id = typeof word === 'string' ? word : word._id;
    // const url = `${this.wordUrl}/?id=${id}`;

    const option = {
      headers: httpOptions.headers,
      body: {
        _id: id
      }
    };

    return this.http.delete<ResultResponse>(this.wordUrl, option).pipe(
      tap(_ => this.log(`deleted word id=${id}`)),
      catchError(this.handleError<ResultResponse>('deleteWord'))
    );
  }

  /** PUT: update the word on the server */
  update (word: Word): Observable<any> {
    return this.http.put(this.wordUrl, word, httpOptions).pipe(
      tap(_ => this.log(`updated word id=${word._id}`)),
      catchError(this.handleError<any>('updateWord'))
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

  /** Log a WordService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`WordService: ${message}`);
  }
}
