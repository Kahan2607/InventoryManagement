import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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


  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getItemsFromApi(){
    const url = 'https://localhost:5034/api/item';
    this.http.get<Item[]>(url).subscribe({
      next: data => this.itemsSubject.next(data),
      error: error => console.log(error)
    });
  }

  addItemByApi(item: Item): Promise<void>{
    console.log(item);
    return new Promise((resolve, reject) => {
    const url = 'https://localhost:5034/api/item/add-item'
    this.http.post(url, item).subscribe({
      next: () => {
        this.getItemsFromApi();
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
}
