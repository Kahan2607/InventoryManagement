import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Item } from '../../model/item.type';
import { CommonModule, NgIf } from '@angular/common';
import { Sale } from '../../model/sale.type';
import { SaleService } from '../../services/sale.service';
import { AddSale } from '../../model/addSale.type';

@Component({
  selector: 'app-add-sale',
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.scss'
})
export class AddSaleComponent {
  addSaleForm: FormGroup;
  itemSales: {
    itemId: number;
    itemName: string;
    isEdit: boolean;
  }[] = [];



  data: string = '';
  newData: number = 0;
  constructor
  (
    private _formBuilder: FormBuilder, 
    private _itemService: ItemService, 
    // private _categoryService: CategoryService,
    private _saleService: SaleService,
    private router: Router,
  )
  {
    this._saleService.currentData.subscribe(data => this.data = data);
    console.log(this.data);
    this.newData = parseInt(this.data);
    console.log(typeof(this.newData));
    

    this.addSaleForm = this._formBuilder.group({
      item: [null, Validators.required], // Dropdown selection
      quantity: [null, [Validators.required, Validators.min(1)]], // Ensure minimum 1
      price: [null, [Validators.required, Validators.min(0.01)]], // Ensure positive price
      salesDate: ['', Validators.required], // Date input
      // insertedDate: [new Date(), Validators.required] // Default to current date
    });
  }

  ngOnInit(){
    this._itemService.getItemsFromApi();

    const itemData$ = this._itemService.items$;

    itemData$.pipe(
      map((items: Item[]) =>
        items.map ( item => ({
          itemId: item.itemId,
          itemName: item.name,
          isEdit: false,
      }) )
    ))
    .subscribe(data => {
      this.itemSales = data;
    });  
  }

  async onSubmit(){
    if(this.addSaleForm.valid){
      // const tempDate = new Date().toISOString().split("T")[0];
      console.log(this.newData);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newSaleRecord: AddSale = {
        salesId: this.newData,
        itemId: this.addSaleForm.value.item,
        quantity: this.addSaleForm.value.quantity,
        price: this.addSaleForm.value.price,
        salesAmount: this.addSaleForm.value.price * this.addSaleForm.value.quantity, 
        salesDate: this.addSaleForm.value.salesDate,
      };

      const salesDate = new Date(this.addSaleForm.value.salesDate);
      
      if (salesDate.getTime() > new Date().getTime()) {
        console.log("dates are compared");
        alert('Add valid salesDate');
        this.router.navigate(['sales/add-sales']);
        
      }
      else{
        if(newSaleRecord.salesId === 0){
          console.log("I am in the api call ");
          console.log(newSaleRecord);
          this._saleService.addNewSalesRecord(newSaleRecord);
          this.addSaleForm.reset();
          this.router.navigate(['/sales']);
        }
        else{
          console.log("Updating the record");
          
          this._saleService.updateSalesRecord(newSaleRecord);
          this.addSaleForm.reset();
          this.router.navigate(['/sales']);
        }
      }
      

      
    }
  }
}
