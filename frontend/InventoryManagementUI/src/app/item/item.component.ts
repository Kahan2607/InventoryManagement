import { Component } from '@angular/core';
import { Item } from '../model/item.type';
import { ItemService } from '../services/item.service';
import { NgFor } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import { combineLatest, forkJoin, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item',
  imports: [NgFor],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  itemsData: {
    categoryName: string;
    itemId: number;
    categoryId: number;
    name: string;
    active: boolean;
  }[] = [];
  categories: Category[] = [];
  constructor(
    private itemService: ItemService, 
    private categoryService: CategoryService,
    private router: Router
  ){}

  ngOnInit(): void{
    this.itemService.getItemsFromApi();
    this.categoryService.getCategoriesFromApi();

    
    combineLatest([this.itemService.items$, this.categoryService.categories$]).pipe(
      map(([items, categories]) =>
        items.map(item => ({
          ...item,
          categoryName: categories.find(category => category.categoryId === item.categoryId)?.name || 'Unknown'
        
        }))
      )
    ).subscribe(data => {
      this.itemsData = data;
    });
  }

  addNewItem(){
    this.itemService.isAdd = true;
    console.log("add-item");
    this.itemService.resetUpdatedItem();
    this.router.navigate(['/items/add-item'])
  }

  deleteItem(itemID: Item['itemId']){
    this.itemService.deleteItem(itemID);
  }

  updateItem(item: Item){
    this.itemService.isAdd = false;
    this.itemService.updateItemData(item);
    this.router.navigate(['items/update-item']);
  }
}
