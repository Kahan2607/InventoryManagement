import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../model/category.type';
import { BehaviorSubject, Observable } from 'rxjs';

// interface PaginatedResponse<Category> {
//   categoryData: Category[];
//   totalItems: number;
// }

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  

  status = 'all';
  private categoriesSubject = new BehaviorSubject<Category[]>([]); // Holds category list
  categories$ = this.categoriesSubject.asObservable(); // Expose as observable
  
  // private paginatedCategoriesSubject = new BehaviorSubject<PaginatedResponse<Category>>({
  //   categoryData: []
  // });
  // paginatedCategories$ = this.paginatedCategoriesSubject.asObservable();
  

  private activeCategoriesSubject = new BehaviorSubject<Category[]>([]); // Holds category list
  activeCategories$ = this.activeCategoriesSubject.asObservable(); // Expose as observable
  
  page = 1;
  itemPerPage = 10;

  constructor(private http: HttpClient) { 
    
  }

  getCategoriesCount(): Observable<number>{
    const url = `https://localhost:5034/api/category/count`;
    return this.http.get<number>(url);
  }

  getPaginatedCategoriesFromApi(page: number, itemsPerPage: number, status: string){
    const url = `https://localhost:5034/api/category/${page}/${itemsPerPage}`;
    const params = new HttpParams()
                        .set('page', page.toString())
                        .set('itemPerPage', itemsPerPage.toString())
                        .set('status', status);
    console.log("insdie category service");
    
    this.http.get<Category[]>(url, { params }).subscribe({
      next: data => this.categoriesSubject.next(data),
      error: error => console.log("Error fetching the data", error)
    });
  }


  getCategoriesFromApi(){
    const url = 'https://localhost:5034/api/category';
    this.http.get<Category[]>(url).subscribe({
      next: data => this.categoriesSubject.next(data),
      error: error => console.log("Error fetching the data", error)
    });
  }

  getActiveCategoriesFromApi(): Observable<Category[]>{
    const url = 'https://localhost:5034/api/category/active-categories';
    return this.http.get<Category[]>(url);
  }

  getInactiveCategoriesFromApi(): Observable<Category[]>{
    const url = 'https://localhost:5034/api/category/inactive-categories';
    return this.http.get<Category[]>(url);
  }

  addCategoryByApi(category: Category){
    // console.log(category);
    const url = 'https://localhost:5034/api/category/add-category';
    this.http.post(url, category).subscribe(() => {
      // this.getCategoriesFromApi();
      this.getPaginatedCategoriesFromApi(this.page, this.itemPerPage, this.status);
    });
  }

  editAndUpdateCategory(category: Category){
    const url = `https://localhost:5034/api/category/update-category${category.categoryId}`;
    this.http.put(url, category).subscribe(() => {
      this.getPaginatedCategoriesFromApi(this.page, this.itemPerPage, this.status);
    });
  }

  deleteACategory(categoryId: Category['categoryId']){
    console.log(categoryId);
    
    const url = `https://localhost:5034/api/category/delete-category${categoryId}`;
    this.http.delete(url).subscribe(() => {
      // this.getCategoriesFromApi();
      this.getPaginatedCategoriesFromApi(this.page, this.itemPerPage, this.status);
    } );
  }

  
}
