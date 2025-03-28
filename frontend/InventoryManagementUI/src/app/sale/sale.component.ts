import { Component } from '@angular/core';
import { SaleService } from '../services/sale.service';
import { ItemService } from '../services/item.service';
import {
  combineLatest,
  debounceTime,
  filter,
  find,
  map,
  mergeAll,
  min,
  pipe,
  switchMap,
} from 'rxjs';
import { Item } from '../model/item.type';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Sale } from '../model/sale.type';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  imports: [NgFor, PaginationComponent, FormsModule, CommonModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss',
})
export class SaleComponent {
  salesData: {
    itemName: string;
    salesId: number;
    itemId: number;
    quantity: number;
    price: number;
    salesAmount: number;
    salesDate: Date;
    insertedDate: Date;
  }[] = [];
  tempSalesData: {
    salesId: number;
    itemId: number;
    quantity: number;
    price: number;
    salesAmount: number;
    salesDate: Date;
    insertedDate: Date;
  }[] = [];
  filteredSalesData: {
    itemName: string;
    salesId: number;
    itemId: number;
    quantity: number;
    price: number;
    salesAmount: number;
    salesDate: Date;
    insertedDate: Date;
  }[] = [];
  items: Item[] = [];
  constructor(
    private itemService: ItemService,
    private saleService: SaleService,
    private router: Router
  ) {}

  paginatedData: Item[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems!: number;
  startingDate = new Date();
  endingDate = new Date();
  sortBy: string = 'saleId';
  sortOrderIsAscending: boolean = true;

  ngOnInit() {
    // this.itemService.getItemsFromApi();
    // this.saleService.getAllSalesDetailsFromApi();

    // combineLatest([this.saleService.sales$, this.itemService.items$])
    //   .pipe(
    //     map(([sales, items]) =>
    //       sales.map((sale) => ({
    //         ...sale,
    //         itemName:
    //           items.find((item) => item.itemId === sale.itemId)?.name ||
    //           'Unknown',
    //       }))
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.salesData = data;
    //     console.log('After subscribing', data);
    //   });
    const itemData$ = this.itemService.getItemsFromApi();
    console.log(itemData$, 'This is inside categoryData');

    this.currentPage = 1;

    this.saleService.getPaginatedSalesRecordFromApi(
      this.currentPage,
      this.itemsPerPage
    );
    this.saleService.sales$.subscribe((data) => {
      this.tempSalesData = data;
    });
    this.saleService.totalSalesRecord$.subscribe((total) => {
      this.totalItems = total;
    });
    combineLatest([this.saleService.sales$, itemData$])
      .pipe(
        map(([sales, items]) =>
          sales.map((sale) => ({
            ...sale,
            itemName:
              items.find((item) => item.itemId === sale.itemId)?.name ||
              'Unknown',
          }))
        )
      )
      .subscribe((data) => {
        this.salesData = data;
        this.filteredSalesData = [...this.salesData];
      });

    this.currentPage = this.saleService.page;
  }

  addNewSale() {
    this.saleService.isAdd = true;
    this.saleService.resetUpdatedSale();
    this.router.navigate(['sales/add-sales']);
  }

  deleteSaleRecord(salesId: Sale['salesId']) {
    this.setData(this.currentPage);
    this.saleService.deleteSalesRecord(salesId);
  }

  updateSalesRecord(sale: Sale) {
    this.saleService.isAdd = false;
    this.saleService.updateSaleData(sale);
    this.router.navigate(['sales/update-sales']);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const itemData$ = this.itemService.getItemsFromApi();
    console.log(itemData$, 'This is inside categoryData');

    // this.currentPage = 1;

    this.saleService.getPaginatedSalesRecordFromApi(
      this.currentPage,
      this.itemsPerPage
    );
    this.saleService.sales$.subscribe((data) => {
      this.tempSalesData = data;
    });
    this.saleService.totalSalesRecord$.subscribe((total) => {
      this.totalItems = total;
    });
    combineLatest([this.saleService.sales$, itemData$])
      .pipe(
        map(([sales, items]) =>
          sales.map((sale) => ({
            ...sale,
            itemName:
              items.find((item) => item.itemId === sale.itemId)?.name ||
              'Unknown',
          }))
        )
      )
      .subscribe((data) => {
        this.salesData = data;
        this.filteredSalesData = [...this.salesData];
      });
  }

  setData(page: number) {
    // this.currentPage = page;
    this.saleService.page = page;
  }

  fetchDataBetweenDates(event: Event) {
    // this.setData(this.currentPage);
    this.currentPage = 1;
    const salesDataBetweenDatesButton = document.getElementById(
      'fetch-data-between-dates'
    );

    const inputStartingDate = document.getElementById(
      'starting-date'
    ) as HTMLInputElement;
    const inputEndingDate = document.getElementById(
      'ending-date'
    ) as HTMLInputElement;

    this.saleService.ifFilter = true;

    if (inputStartingDate.value != '') {
      this.saleService.ifStartingDate = true;
      this.saleService.startingDate = this.startingDate;
    }
    if (inputEndingDate.value != '') {
      this.saleService.ifEndingDate = true;
      this.saleService.endingDate = this.endingDate;
    }

    const itemData$ = this.itemService.getItemsFromApi();

    this.saleService.getPaginatedSalesRecordFromApi(this.currentPage, 10);
    const filteredSalesData$ = this.saleService.sales$;
    this.saleService.totalSalesRecord$.subscribe((value) => {
      this.totalItems = value;
      console.log('Inside the fetchBetweenData method ', this.totalItems);
    });
    // const filteredSalesData$ = this.saleService.sales$.pipe(
    //   map((sales) => {
    //     return sales.filter(
    //       (sale) =>
    //         sale.salesDate >= this.startingDate &&
    //         sale.salesDate <= this.endingDate
    //     );
    //   })
    // );

    const tempSalesData$ = combineLatest([filteredSalesData$, itemData$])
      .pipe(
        map(([sales, items]) =>
          sales.map((sale) => ({
            ...sale,
            itemName:
              items.find((item) => item.itemId == sale.itemId)?.name ||
              'Unknown',
          }))
        )
      )
      .subscribe((data) => {
        this.salesData = data;
        this.filteredSalesData = [...this.salesData];
      });
  }

  sortingSalesData(sortBy: string) {
    if (this.sortBy !== sortBy) {
      this.saleService.sortOrderIsAscending = true;
    } else {
      this.sortOrderIsAscending = !this.sortOrderIsAscending;
      this.saleService.sortOrderIsAscending = this.sortOrderIsAscending;
    }

    this.sortBy = sortBy;
    this.saleService.sortBy = sortBy;
    this.currentPage = 1;

    const itemData$ = this.itemService.getItemsFromApi();

    this.saleService.getPaginatedSalesRecordFromApi(this.currentPage, 10);

    this.saleService.sales$.subscribe((data) => {
      this.tempSalesData = data;
    });
    this.saleService.totalSalesRecord$.subscribe((value) => {
      this.totalItems = value;
    });
    combineLatest([this.saleService.sales$, itemData$])
      .pipe(
        map(([sales, items]) =>
          sales.map((sale) => ({
            ...sale,
            itemName:
              items.find((item) => item.itemId === sale.itemId)?.name ||
              'Unknown',
          }))
        )
      )
      .subscribe((data) => {
        this.salesData = data;
        this.filteredSalesData = [...this.salesData];
      });
  }
}
