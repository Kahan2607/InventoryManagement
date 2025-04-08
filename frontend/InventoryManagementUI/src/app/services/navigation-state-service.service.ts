import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateService {
  constructor() {}
  private cameFromItems = false;
  private cameFromSales = false;

  setFromItemsPage(val: boolean) {
    this.cameFromItems = true;
  }

  hasComeFromItemsPage(): boolean {
    return this.cameFromItems;
  }

  setFromSalesPage(val: boolean) {
    this.cameFromSales = true;
  }

  hasComeFromSalesPage(): boolean {
    return this.cameFromSales;
  }
}
