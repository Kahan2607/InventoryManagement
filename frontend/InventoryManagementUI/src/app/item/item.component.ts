import { Component } from '@angular/core';
import { Item } from '../model/item.type';
import { ItemService } from '../services/item.service';
import { NgFor } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import { combineLatest, forkJoin, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { PaginationComponent } from "../components/pagination/pagination.component";

@Component({
  selector: 'app-item',
  imports: [NgFor, PaginationComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  tempItemData: {
    itemId: number;
    categoryId: number;
    name: string;
    active: boolean;
  }[] = [];
  itemsData: {
    categoryName: string;
    itemId: number;
    categoryId: number;
    name: string;
    active: boolean;
  }[] = [];
  filteredItemsData: {
    categoryName: string;
    itemId: number;
    categoryId: number;
    name: string;
    active: boolean;
  }[] = [];

  paginatedData: Item[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems!: number;

  status = 'all';

  categories: Category[] = [];
  constructor(
    private itemService: ItemService, 
    private categoryService: CategoryService,
    private router: Router
  ){}

  ngOnInit(): void{
    // this.itemService.getItemsFromApi();
    
    // combineLatest([this.itemService.items$, this.categoryService.categories$]).pipe(
    //   map(([items, categories]) =>
    //     items.map(item => ({
    //       ...item,
    //       categoryName: categories.find(category => category.categoryId === item.categoryId)?.name || 'Unknown'
        
    //     }))
    //   )
    // ).subscribe(data => {
    //   this.itemsData = data;
    // });
    // this.itemService.getItemsCount().subscribe(
    //   (data) => this.totalItems = data
    // ); 

    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, "This is inside categoryData");
    

    this.currentPage = 1;

    this.itemService.getPaginatedItemsFromApi(this.currentPage, this.itemsPerPage, this.status);
    this.itemService.items$.subscribe(
      (data) => {
        this.tempItemData = data;
      }
      );
      this.itemService.totalItems$.subscribe(
        total => {
          this.totalItems = total;
        }
    );


    combineLatest([this.itemService.items$, categoryData$]).pipe(
      map(([items, categories]) =>
        items.map(item => ({
          ...item,
          categoryName: categories.find(category => category.categoryId === item.categoryId)?.name || 'Unknown'
        
        }))
      )
    ).subscribe(data => {
      this.itemsData = data;
      this.filteredItemsData = [...this.itemsData];
    });
  }

  addNewItem(){
    console.log("Inside the addNewItem method ", this.status);
    
    this.setData(this.currentPage, this.status);

    this.itemService.isAdd = true;
    // console.log("add-item");
    this.itemService.resetUpdatedItem();
    // this.itemService.sendPageData();
    this.router.navigate(['/items/add-item']);
  }

  deleteItem(itemID: Item['itemId']){
    this.setData(this.currentPage, this.status);
    this.itemService.deleteItem(itemID);
  }

  updateItem(item: Item){
    this.itemService.isAdd = false;
    this.itemService.updateItemData(item);
    this.router.navigate(['items/update-item']);
  }

  filterCategories(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    this.status = selectedValue;
    console.log(selectedValue);
    
    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, "This is inside categoryData");
    this.itemService.getPaginatedItemsFromApi(this.currentPage, this.itemsPerPage, this.status);
    // this.categoryService.categories$.subscribe(
    //   (data) => {
    //     this.categories = data;
    //     this.filteredCategories = [...this.categories];
    //   }
    // );
    this.itemService.items$.subscribe(
      (data) => {
        this.tempItemData = data;
      }
      );
      this.itemService.totalItems$.subscribe(
        total => {
          this.totalItems = total;
        }
    );


    combineLatest([this.itemService.items$, categoryData$]).pipe(
      map(([items, categories]) =>
        items.map(item => ({
          ...item,
          categoryName: categories.find(category => category.categoryId === item.categoryId)?.name || 'Unknown'
        }))
      )
    ).subscribe(data => {
      this.itemsData = data;
      this.filteredItemsData = [...this.itemsData];
    });

  }
  

  onPageChange(page: number){
    this.currentPage = page;
    // this.fetchData();

    
    this.itemService.getItemsCount().subscribe(
      (data) => this.totalItems = data
    ); 
    this.itemService.getPaginatedItemsFromApi(this.currentPage, this.itemsPerPage, this.status);
    this.itemService.items$.subscribe(
      (data) => {
        this.tempItemData = data;
      }
    );
    this.itemService.totalItems$.subscribe(
      total => {
        this.totalItems = total;
      }
    );
    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, "This is inside categoryData");

    combineLatest([this.itemService.items$, categoryData$]).pipe(
      map(([items, categories]) =>
        items.map(item => ({
          ...item,
          categoryName: categories.find(category => category.categoryId === item.categoryId)?.name || 'Unknown'
        
        }))
      )
    ).subscribe(data => {
      this.itemsData = data;
      this.filteredItemsData = [...this.itemsData];
    });
  }

  setData(page: number, status: string){
    this.itemService.page = page;
    this.itemService.status = status;
    console.log("Inside the setData method ",status);
    
  }
}
