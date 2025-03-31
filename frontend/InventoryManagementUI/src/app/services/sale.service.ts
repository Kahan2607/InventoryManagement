import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from '../model/sale.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddSale } from '../model/addSale.type';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  isAdd = false;
  updatedSale: Sale = {
    salesId: 0,
    itemId: 0,
    quantity: 0,
    price: 0,
    salesAmount: 0,
    salesDate: new Date(),
    insertedDate: new Date(),
  };
  page = 1;
  itemPerPage = 10;
  totalItems = 0;
  ifFilter: boolean = false;
  ifStartingDate: boolean = false;
  ifEndingDate: boolean = false;
  startingDate: Date = new Date();
  endingDate: Date = new Date();
  specificNameFilter: boolean = false;
  itemId: number = 0;

  sortBy: string = 'saleId';
  sortOrderIsAscending: boolean = true;

  private saleSubject = new BehaviorSubject<Sale[]>([]);
  sales$ = this.saleSubject.asObservable();

  private totalSalesRecordSubject = new BehaviorSubject<number>(0);
  totalSalesRecord$ = this.totalSalesRecordSubject.asObservable();

  constructor(private http: HttpClient) {}

  getSalesCount(): Observable<number> {
    const url = `https://localhost:5034/api/sale/count`;
    return this.http.get<number>(url);
  }

  getPaginatedSalesRecordFromApi(page: number, itemsPerPage: number) {
    console.log('Value of page is ', page);

    const url = `https://localhost:5034/api/sale/${page}/${itemsPerPage}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString())
      .set('sortBy', this.sortBy)
      .set('sortOrderIsAscending', this.sortOrderIsAscending);
    console.log("inside item's service");

    if (this.specificNameFilter) {
      params = params.set('itemId', this.itemId.toString());
    }

    if (this.ifFilter && this.ifStartingDate) {
      params = params.set('startingDate', this.startingDate.toString());
    }
    if (this.ifFilter && this.ifEndingDate) {
      params = params.set('endingDate', this.endingDate.toString());
    }

    this.http
      .get<{ saleData: Sale[]; totalItems: number }>(url, { params })
      .subscribe({
        next: (response) => {
          this.saleSubject.next(response.saleData); // Update category data
          this.totalSalesRecordSubject.next(response.totalItems); // Update total items count
        },
        error: (error) => console.log('Error fetching the data', error),
      });
  }

  getAllSalesDetailsFromApi(): Observable<Sale[]> {
    const url = 'https://localhost:5034/api/sale';
    return this.http.get<Sale[]>(url);
  }

  addNewSalesRecord(sale: AddSale) {
    const url = 'https://localhost:5034/api/sale/add-sale';
    this.http.post(url, sale).subscribe(() => {
      // this.getAllSalesDetailsFromApi();
      this.getPaginatedSalesRecordFromApi(this.page, 10);
    });
  }

  deleteSalesRecord(salesId: Sale['salesId']) {
    const url = `https://localhost:5034/api/sale/delete-sale${salesId}`;
    this.http.delete(url).subscribe(() => {
      // this.getAllSalesDetailsFromApi();
      this.getPaginatedSalesRecordFromApi(this.page, 10);
    });
  }

  updateSalesRecord(sale: AddSale) {
    console.log('Inside service');

    const url = `https://localhost:5034/api/sale/update-sale${sale.salesId}`;
    this.http.put(url, sale).subscribe(() => {
      // this.getAllSalesDetailsFromApi();
      this.getPaginatedSalesRecordFromApi(this.page, 10);
    });
  }

  updateSaleData(sale: Sale) {
    this.updatedSale = sale;
  }

  resetUpdatedSale() {
    this.updatedSale = {
      salesId: 0,
      itemId: 0,
      quantity: 0,
      price: 0,
      salesAmount: 0,
      salesDate: new Date(),
      insertedDate: new Date(),
    };
  }
}
