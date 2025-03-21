import { Component } from '@angular/core';
import { Item } from '../model/item.type';
import { ItemService } from '../services/item.service';
import { SaleService } from '../services/sale.service';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { Sale } from '../model/sale.type';

@Component({
  selector: 'app-sale',
  imports: [],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
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
  items: Item[] = [];
  constructor(
    private itemService: ItemService,
    private saleService: SaleService,
    private router: Router,
  )
  {
  }

  ngOnInit(){
    this.itemService.getItemsFromApi();
    this.saleService.getAllSalesDetailsFromApi();
    

    combineLatest([this.saleService.sales$, this.itemService.items$]).pipe(
      map(([sales, items]) => 
        sales.map(sale => ({
          ...sale,
          itemName: items.find(item => item.itemId === sale.itemId)?.name || 'Unknown'

        }))
      )
    )
    .subscribe((data) => {
      this.salesData = data;
      console.log("After subscribing", data);

    });
  }

  addNewSale(){
    console.log("hello in the add new sale method of sale component");
    
    this.router.navigate(['sales/add-sales']);
  }


  deleteSaleRecord(salesId: Sale['salesId']){
    this.saleService.deleteSalesRecord(salesId);
  }

  updateSalesRecord(sale: Sale){
    this.saleService.isAdd = false;
    this.router.navigate(['sales/update-sales']);
  }
}
