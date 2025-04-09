import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  loadingOn() {
    console.log('Spinner on: ');

    this.loadingSubject.next(true);
  }

  loadingOff() {
    console.log('Spinner off: ');
    this.loadingSubject.next(false);
  }
}
