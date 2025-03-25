import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogueBoxComponent } from '../components/dialogue-box/dialogue-box.component';
import { FormsModule } from '@angular/forms';
import { groupBy, map } from 'rxjs';
import { PaginationComponent } from "../components/pagination/pagination.component";

@Component({
  selector: 'app-category',
  imports: [NgFor, FormsModule, PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  status = 'all';

  paginatedData: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems!: number;
  constructor(private categoryService: CategoryService, public dialog: MatDialog){
  }

  isAscendingId: boolean = false;
  isAscendingName: boolean = false;

  ngOnInit(): void {
    // this.categoryService.getCategoriesFromApi();
      // this.categoryService.categories$.subscribe(
      //   (data) => {
      //     this.categories = data;
      //     this.filteredCategories = [...this.categories];
      //   }
      // );
      // this.filteredCategories = this.categories;
    this.categoryService.getCategoriesCount().subscribe(
      (data) => this.totalItems = data
    ); 
    this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage, this.status);
      this.categoryService.categories$.subscribe(
        (data) => {
          this.categories = data;
          this.filteredCategories = [...this.categories];
        }
    );
    console.log(this.filteredCategories);
    

    // this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage)
    //   this.categoryService.categories$.subscribe({
    //   next: (response) => {
    //     console.log(response.categoryData, response.totalItems);
        
    //     this.filteredCategories = response.categoryData;
    //     this.totalItems = response.totalItems;
    //   },
    //   error: (error) => {
    //     console.log("Error getting paginated data from categories api call.");
    //   }
    // });

    // this.fetchData();
  }

  openDialog(): void {
    this.setData(this.currentPage, this.status);
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
    this.setData(this.currentPage, this.status);
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
    // this.categoryService.page = this.currentPage;
  }

  deleteCategory(categoryId: Category['categoryId']){
    this.setData(this.currentPage, this.status);
    this.categoryService.deleteACategory(categoryId);
  }


  sortByCategoryId(){
    this.isAscendingId =  !this.isAscendingId;
    this.filteredCategories.sort((a,b) => 
      this.isAscendingId ? b.categoryId - a.categoryId: a.categoryId - b.categoryId
    );
  }

  sortByCategoryName(){
    this.isAscendingName = !this.isAscendingName;
    this.filteredCategories.sort((a,b) => 
      this.isAscendingName ? b.name.localeCompare(a.name): a.name.localeCompare(b.name) 
    );
  }

  filterCategories(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    if (selectedValue === 'all'){
      this.status = 'all';
      this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage, this.status);
      this.categoryService.categories$.subscribe(
        (data) => {
          this.categories = data;
          this.filteredCategories = [...this.categories];
        }
      );
      // this.filteredCategories = this.categories;
      // this.fetchData();
    }else if (selectedValue === 'active') {
      this.status = 'active'
      this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage, 'active');
      this.categoryService.categories$.subscribe(
        (data) => {
          this.categories = data;
          this.filteredCategories = [...this.categories];
        }
      );
    
    }else if (selectedValue === 'inactive') {
      this.status = 'inactive';
      this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage, this.status);
      this.categoryService.categories$.subscribe(
        (data) => {
          this.categories = data;
          this.filteredCategories = [...this.categories];
        }
      );
    }
  }

  // fetchData(): void {
  //   this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage).subscribe({
  //     next: (response) => {
  //       console.log(response.categoryData, response.totalItems);
        
  //       this.filteredCategories = response.categoryData;
  //       this.totalItems = response.totalItems;
  //     },
  //     error: (error) => {
  //       console.log("Error getting paginated data from categories api call.");
  //     }
  //   });
  // }


  onPageChange(page: number): void {
    this.currentPage = page;
    // this.fetchData();

    
    this.categoryService.getPaginatedCategoriesFromApi(this.currentPage, this.itemsPerPage, this.status);
    this.categoryService.categories$.subscribe(
      (data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
      }
    );
  }

  ngOnDestroy(){
    console.log("category componente getting destroyed.");
    
  }

  setData(page: number, status: string){
    this.categoryService.page = this.currentPage;
    this.categoryService.status = status;
  }
}
