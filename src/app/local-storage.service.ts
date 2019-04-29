import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  

  constructor() { }

  public cacheLocal () {
    return localStorage.getItem(environment.settings.cacheLocal);
  }

  public get(key: string): any {
    return localStorage.getItem(key);
  }

  public getArray(key: string): any {
    const strLocal = this.get(key);
    if (!strLocal) return [];

    const arrLocal = JSON.parse(strLocal);
    if (!arrLocal || !arrLocal.length) return [];
    
    return arrLocal;
  }

  public set(key: string, value: any) {    
    localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
