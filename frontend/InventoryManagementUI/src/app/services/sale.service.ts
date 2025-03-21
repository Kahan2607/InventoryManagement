import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from '../model/sale.type';
import { BehaviorSubject } from 'rxjs';
import { AddSale } from '../model/addSale.type';

@Injectable({
  providedIn: 'root'
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
    insertedDate: new Date()
  };
  private saleSubject = new BehaviorSubject<Sale[]>([]);
  sales$ = this.saleSubject.asObservable();

  constructor(private http: HttpClient) { 

  }

  getAllSalesDetailsFromApi(){
    const url = 'https://localhost:5034/api/sale';
    this.http.get<Sale[]>(url).subscribe({
      next: data => this.saleSubject.next(data),
      error: error => console.log(error),
    }); 
  }

  addNewSalesRecord(sale: AddSale){
    const url = 'https://localhost:5034/api/sale/add-sale';
    this.http.post(url, sale).subscribe(() => {
      this.getAllSalesDetailsFromApi();
    });
  }

  deleteSalesRecord(salesId: Sale['salesId']){
    const url = `https://localhost:5034/api/sale/delete-sale${salesId}`;
    this.http.delete(url).subscribe(() => {
      this.getAllSalesDetailsFromApi();
    });
  }

  updateSalesRecord(sale: AddSale){
      console.log("Inside service");
      
      const url = `https://localhost:5034/api/sale/update-sale${sale.salesId}`;
      this.http.put(url, sale).subscribe(() =>{
        this.getAllSalesDetailsFromApi();
      });
    }

  updateSaleData(sale: Sale){
    this.updatedSale = sale;
  }

  resetUpdatedSale(){
    this.updatedSale = {
      salesId: 0,
      itemId: 0,
      quantity: 0,
      price: 0,
      salesAmount: 0,
      salesDate: new Date(),
      insertedDate: new Date()
    };
  }

}
