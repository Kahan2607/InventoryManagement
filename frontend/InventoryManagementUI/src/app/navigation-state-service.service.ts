import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateService {
  constructor() {}
  private cameFromItems = false;

  setFromItemsPage(val: boolean) {
    this.cameFromItems = true;
  }

  hasComeFromItemsPage(): boolean {
    return this.cameFromItems;
  }
}
