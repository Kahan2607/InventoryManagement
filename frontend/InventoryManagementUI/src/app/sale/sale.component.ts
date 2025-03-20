import { Component } from '@angular/core';
import { SaleService } from '../services/sale.service';
import { ItemService } from '../services/item.service';
import { combineLatest, map } from 'rxjs';
import { Item } from '../model/item.type';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Sale } from '../model/sale.type';

@Component({
  selector: 'app-sale',
  imports: [NgFor],
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
    this.saleService.isAdd = true;
    this.saleService.resetUpdatedSale();
    this.router.navigate(['sales/add-sales']);
  }


  deleteSaleRecord(salesId: Sale['salesId']){
    this.saleService.deleteSalesRecord(salesId);
  }

  updateSalesRecord(sale: Sale){
<<<<<<< HEAD
    this.saleService.isAdd = false;
    this.saleService.updateSaleData(sale);
    this.router.navigate(['sales/update-sales']);
  }
=======
    const isEdit = true;
    const saleId = sale['salesId'];
    this.sendData(saleId.toString());
    this.router.navigate(['sales/update-sales']);
  }

  sendData(saleId: string) {
    this.saleService.updateData(saleId);
  }
>>>>>>> 559d66c (feat(sale): added the functionality to edit the records of a sale.)
}
