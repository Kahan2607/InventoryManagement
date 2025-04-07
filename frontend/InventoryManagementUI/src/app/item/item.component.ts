import { Component } from '@angular/core';
import { Item } from '../model/item.type';
import { ItemService } from '../services/item.service';
import { NgFor } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import {
  combineLatest,
  debounceTime,
  forkJoin,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { Target } from '@angular/compiler';
import { DeleteInfoMessageComponent } from '../components/delete-info-message/delete-info-message.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

interface ItemView {
  itemId: number;
  categoryId: number;
  name: string;
  active: string;
}

@Component({
  selector: 'app-item',
  imports: [NgFor, PaginationComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  dialogRef?: MatDialogRef<DeleteInfoMessageComponent>;
  tempItemData: {
    itemId: number;
    categoryId: number;
    name: string;
    // active: boolean;
    active: string;
  }[] = [];
  itemsData: {
    categoryName: string;
    itemId: number;
    categoryId: number;
    name: string;
    // active: boolean;
    active: string;
  }[] = [];
  filteredItemsData: {
    categoryName: string;
    itemId: number;
    categoryId: number;
    name: string;
    // active: boolean;
    active: string;
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
    private router: Router,
    public dialog: MatDialog
  ) {}

  sortBy: string = 'itemId';
  sortOrderIsAscending: boolean = true;
  ngOnInit(): void {
    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, 'This is inside categoryData');

    this.currentPage = 1;

    this.itemService.getPaginatedItemsFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.itemService.items$
      .pipe(
        map((items: Item[]) =>
          items.map((item: Item) => ({
            ...item,
            active: item.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.tempItemData = data;
      });
    this.itemService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });

    combineLatest([this.itemService.items$, categoryData$])
      .pipe(
        map(([items, categories]) =>
          items.map((item) => ({
            ...item,
            active: item.active ? 'Yes' : 'No', // ✅ Convert to string
            categoryName:
              categories.find(
                (category) => category.categoryId === item.categoryId
              )?.name || 'Unknown',
          }))
        )
      )
      .subscribe((data) => {
        this.itemsData = data;
        this.filteredItemsData = [...this.itemsData];
      });
  }

  addNewItem() {
    console.log('Inside the addNewItem method ', this.status);

    this.itemService.isAdd = true;
    this.itemService.resetUpdatedItem();
    this.router.navigate(['/items/add-item']);
  }

  deleteItem(itemID: Item['itemId']) {
    this.setData(this.currentPage, this.status);
    this.itemService.deleteItem(itemID);
  }

  updateItem(item: ItemView) {
    this.itemService.isAdd = false;
    let itemStatus = false;
    if (item.active === 'Yes') {
      itemStatus = true;
    } else if (item.active === 'No') {
      itemStatus = false;
    }

    const newItem = {
      itemId: item.itemId,
      categoryId: item.categoryId,
      name: item.name,
      active: itemStatus,
    };
    // this.setData(this.currentPage, this.status);
    this.itemService.updateItemData(newItem);
    this.router.navigate(['items/update-item']);
  }

  filterItems(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.currentPage = 1;
    this.status = selectedValue;
    console.log(selectedValue);

    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, 'This is inside categoryData');
    this.itemService.getPaginatedItemsFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.itemService.items$
      .pipe(
        map((items: Item[]) =>
          items.map((item: Item) => ({
            ...item,
            active: item.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.tempItemData = data;
      });
    this.itemService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // this.fetchData();

    this.itemService
      .getItemsCount()
      .subscribe((data) => (this.totalItems = data));
    this.itemService.getPaginatedItemsFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.itemService.items$
      .pipe(
        map((items: Item[]) =>
          items.map((item: Item) => ({
            ...item,
            active: item.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.tempItemData = data;
      });
    this.itemService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });
    const categoryData$ = this.categoryService.getAllCategoriesFromApi();
    console.log(categoryData$, 'This is inside categoryData');
  }

  setData(page: number, status: string) {
    this.status = status;
    this.currentPage = page;
    this.itemService.page = page;
    this.itemService.status = status;
    console.log('Inside the setData method ', status);
  }

  fetchResults(event: Event) {
    const inputSearchElement = document.getElementById(
      'search-items'
    ) as HTMLInputElement;
    console.log('User typed: ', inputSearchElement.value);

    this.currentPage = 1;

    this.itemService.ifNameFilter = true;
    this.itemService.itemNameFromSearchFilter = inputSearchElement.value;

    const categoryData$ = this.categoryService.getAllCategoriesFromApi();

    fromEvent(inputSearchElement, 'input')
      .pipe(
        debounceTime(300),
        map((event: Event) => (event.target as HTMLInputElement).value),
        tap(() => {
          this.itemService.getPaginatedItemsFromApi(
            this.currentPage,
            this.itemsPerPage,
            this.status
          );
        }),
        switchMap((searchText) =>
          combineLatest([
            this.itemService.items$.pipe(
              map((items) =>
                items.filter((item) =>
                  item.name.toLowerCase().includes(searchText.toLowerCase())
                )
              )
            ),

            categoryData$,
          ]).pipe(
            map(([filteredItems, categories]) =>
              filteredItems.map((item) => ({
                ...item,
                active: item.active ? 'Yes' : 'No', // ✅ Convert to string
                categoryName:
                  categories.find(
                    (category) => category.categoryId === item.categoryId
                  )?.name || 'Unknown',
              }))
            )
          )
        )
      )
      .subscribe((data) => {
        this.itemsData = data;
        this.filteredItemsData = [...this.itemsData];
        console.log(this.filteredItemsData);
      });
  }

  confirmMessage(itemId: Item['itemId']) {
    this.dialogRef = this.dialog.open(DeleteInfoMessageComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteItem(itemId);
      }
      this.dialogRef = undefined;
    });
  }

  sortItems(sortBy: string) {
    if (this.sortBy !== sortBy) {
      this.itemService.sortOrderIsAscending = true;
    } else {
      this.sortOrderIsAscending = !this.sortOrderIsAscending;
      this.itemService.sortOrderIsAscending = this.sortOrderIsAscending;
    }

    this.sortBy = sortBy;
    this.itemService.sortBy = sortBy;
    this.currentPage = 1;

    const categoryData$ = this.categoryService.getAllCategoriesFromApi();

    this.itemService.getPaginatedItemsFromApi(
      this.currentPage,
      10,
      this.status
    );

    this.itemService.items$
      .pipe(
        map((items: Item[]) =>
          items.map((item: Item) => ({
            ...item,
            active: item.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.tempItemData = data;
      });
    this.categoryService.totalItems$.subscribe((value) => {
      this.totalItems = value;
    });
  }
}
