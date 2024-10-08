import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchChanged$ = new Subject<string>();

  constructor() { }
}
