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
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Sale } from '../model/sale.type';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  imports: [NgFor, PaginationComponent, FormsModule],
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
    const salesDataBetweenDatesButton = document.getElementById(
      'fetch-data-between-dates'
    );

    const itemData$ = this.itemService.getItemsFromApi();

    this.saleService.getPaginatedSalesRecordFromApi(this.currentPage, 10);
    const filteredSalesData$ = this.saleService.sales$.pipe(
      map((sales) => {
        return sales.filter(
          (sale) =>
            sale.salesDate >= this.startingDate &&
            sale.salesDate <= this.endingDate
        );
      })
    );

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

  // ngOnDestroy() {
  //   console.log('sale component destroyed.');
  // }
}
