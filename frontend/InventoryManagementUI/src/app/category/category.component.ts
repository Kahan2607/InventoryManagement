import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogueBoxComponent } from '../components/dialogue-box/dialogue-box.component';
import { FormsModule } from '@angular/forms';
import { groupBy, map } from 'rxjs';
import { B } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-category',
  imports: [NgFor, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  constructor(private categoryService: CategoryService, public dialog: MatDialog){
  }

  isDescendingId: boolean = false;
  isDescendingName: boolean = false;
  // isActive: boolean = false;

  ngOnInit(): void {
    
    this.categoryService.getCategoriesFromApi();
    this.categoryService.categories$.subscribe(
      (data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
      }
    );
  }

  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogueBoxComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data:{
        title: 'Add'
      }
    });
  }

  update(category: Category){
    
    const dialogRef = this.dialog.open(DialogueBoxComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data:{
        title: 'Edit',
        categoryId: category.categoryId,
        name: category.name,
        active: false,
      }
    });
  }

  deleteCategory(categoryId: Category['categoryId']){
    
    this.categoryService.deleteACategory(categoryId);
  }


  sortByCategoryId(){
    this.isDescendingId =  !this.isDescendingId;
    this.categories.sort((a,b) => 
      this.isDescendingId ? b.categoryId - a.categoryId: a.categoryId - b.categoryId
    );
  }

  sortByCategoryName(){
    this.isDescendingName = !this.isDescendingName;
    this.categories.sort((a,b) => 
      this.isDescendingName ? b.name.localeCompare(a.name): a.name.localeCompare(b.name) 
    );
  }

  filterCategories(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    if (selectedValue === 'all'){
      this.filteredCategories = this.categories;
    }else if (selectedValue === 'active') {
      this.filteredCategories = this.categories.filter(category => category.active);
    }else if (selectedValue === 'inactive') {
      this.filteredCategories = this.categories.filter(category => !category.active);
    }
  }
}
