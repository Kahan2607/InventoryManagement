import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { map } from 'rxjs';
import { Category } from '../../model/category.type';
import { Item } from '../../model/item.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-item',
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {
  addItemForm: FormGroup;
  categoryData: {
    categoryId: number;
    categoryName: string;
    isEdit: boolean;
  }[] = [];

  isAdd: boolean = true;
  editItemData: Item = {
    categoryId: 0,
    itemId: 0,
    name: '',
    active: false
  };
  constructor
  (
    private _formBuilder: FormBuilder, 
    private _itemService: ItemService, 
    private _categoryService: CategoryService,
    private router: Router,
  )
  {
    this.addItemForm = this._formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      active: [false, Validators.required]
    });
    
    this.isAdd = this._itemService.isAdd;
    this.editItemData = this._itemService.updatedItem;

    this.addItemForm.patchValue({
      name: this.editItemData.name,
      category: this.editItemData.categoryId,
      acive: this.editItemData.active
    });
  }

  ngOnInit(){
    this._categoryService.getCategoriesFromApi();
    const categoryData$ = this._categoryService.categories$;

    categoryData$.pipe(
      map((categories: Category[]) =>
        categories.map ( category => ({
          categoryId: category.categoryId,
          categoryName: category.name,
          isEdit: false,
      }) )
    ))
    .subscribe(data => {
      this.categoryData = data;
    });  
      
  }

  ngOnDestroy(){
    console.log("add-item component destroyed.");
    
  }

  async onSubmit(){
    if(this.addItemForm.valid){
      
      const newItem: Item = {
        itemId: this.editItemData.itemId,
        categoryId: this.addItemForm.value.category,
        name: this.addItemForm.value.name,
        active: this.addItemForm.value.active
      };
      
      console.log(typeof(newItem.itemId), newItem.itemId);
      
      if(this.isAdd === true){
        await this._itemService.addItemByApi(newItem);
        console.log("inside add ");
        
      }
      else{
        this._itemService.updateItemByApi(newItem);
        this._itemService.updatedItem = {
          categoryId: 0,
          itemId: 0,
          name: '',
          active: false
        };
        console.log(this.editItemData);
        
        console.log("inside update api");
      }

      this.addItemForm.reset();
      this.router.navigate(['/items']);
      
    }
  }

  
}
