import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Word } from './word';
import { MessageService } from './message.service';

import { environment } from './../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class WordService {

  private groupUrl = environment.groupUrl;  // URL to web api
  private wordUrl = environment.wordUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** GET words from the server */
  getWords (): Observable<Word[]> {
    return this.http.get<Word[]>(this.wordUrl)
      .pipe(
        tap(words => this.log('fetched words')),
        catchError(this.handleError('getWords', []))
      );
  }

  /** GET word by id. Will 404 if id not found */
  getWord(id: string): Observable<Word> {
    const url = `${this.wordUrl}/?id=${id}`;
    return this.http.get<Word>(url).pipe(
      tap(_ => this.log(`fetched word id=${id}`)),
      catchError(this.handleError<Word>(`getWord id=${id}`))
    );
  }

  /* GET words whose name contains search term */
  searchWords(term: string): Observable<Word[]> {
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

  /** POST: add a new word to the server */
  addWord (word: Word): Observable<Word> {
    return this.http.post<Word>(this.wordUrl, word, httpOptions).pipe(
      tap((word: Word) => this.log(`added word w/ id=${word._id}`)),
      catchError(this.handleError<Word>('addWord'))
    );
  }

  /** DELETE: delete the word from the server */
  deleteWord (word: Word | string): Observable<Word> {
    const id = typeof word === 'string' ? word : word._id;
    const url = `${this.wordUrl}/?id=${id}`;

    return this.http.delete<Word>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted word id=${id}`)),
      catchError(this.handleError<Word>('deleteWord'))
    );
  }

  /** PUT: update the word on the server */
  updateWord (word: Word): Observable<any> {
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
