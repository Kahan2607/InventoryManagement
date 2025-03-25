import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Item } from '../model/item.type';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  isAdd: boolean = false;
  updatedItem: Item = {
    itemId: 0,
    categoryId: 0,
    active: false,
    name: ''
  }; 


  // private itemsSubject = new BehaviorSubject<Item[]>([]);
  // items$ = this.itemsSubject.asObservable();
  page = 1;
  itemPerPage = 10;
  totalItems = 0;

  status = 'all';
  private itemsSubject = new BehaviorSubject<Item[]>([]); // Holds category list
  items$ = this.itemsSubject.asObservable(); // Expose as observable
  

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();


  constructor(private http: HttpClient) { }

  getItemsCount(): Observable<number>{
      const url = `https://localhost:5034/api/item/count`;
      return this.http.get<number>(url);
    }

  getPaginatedItemsFromApi(page: number, itemsPerPage: number, status: string){
    console.log("Value of page is ",page);
    
    const url = `https://localhost:5034/api/item/${page}/${itemsPerPage}`;
    const params = new HttpParams()
                        .set('page', page.toString())
                        .set('itemsPerPage', itemsPerPage.toString())
                        .set('status', status);
    console.log("inside item's service");
    
    this.http.get<{itemData: Item[], totalItems: number}>(url, { params }).subscribe({
      next: response => {
        this.itemsSubject.next(response.itemData); // Update category data
        console.log(response.totalItems);
        
        this.totalItemsSubject.next(response.totalItems);   // Update total items count
      },
      error: error => console.log("Error fetching the data", error)
    });
  }

  getItemsFromApi(){
    const url = 'https://localhost:5034/api/item';
    this.http.get<Item[]>(url).subscribe({
      next: data => this.itemsSubject.next(data),
      error: error => console.log(error)
    });
  }

  addItemByApi(item: Item): Promise<void>{
    console.log(this.status);
    
    console.log("Inside api call", item);
    return new Promise((resolve, reject) => {
    const url = 'https://localhost:5034/api/item/add-item'
    this.http.post(url, item).subscribe({
      next: () => {
        this.getPaginatedItemsFromApi(this.page , 10, this.status);
        resolve();
      },
      error: (error) => console.log(error),
      
    })});
  }


  deleteItem(itemId: Item['itemId']){
    const url = `https://localhost:5034/api/item/delete-item${itemId}`;
    this.http.delete(url).subscribe(() => {
      this.getItemsFromApi();
    });
  }

  updateItemByApi(item: Item){
    const url = `https://localhost:5034/api/item/update-item${item.itemId}`;
    this.http.put(url, item).subscribe(() =>{
      this.getItemsFromApi();
    });
  }

  updateItemData(item: Item){
    this.updatedItem = item;
  }

  resetUpdatedItem(){
    this.updatedItem = {
      itemId: 0,
      categoryId: 0,
      active: false,
      name: ''
    };
  }

  // getCategoryNameInTheData(){
    
  // }
}
