import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category.type';
import { NgFor } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogueBoxComponent } from '../components/dialogue-box/dialogue-box.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent, groupBy, map, switchMap, tap } from 'rxjs';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { DeleteInfoMessageComponent } from '../components/delete-info-message/delete-info-message.component';

interface CategoryView {
  categoryId: number;
  name: string;
  active: string;
}

@Component({
  selector: 'app-category',
  imports: [NgFor, FormsModule, PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  dialogRef?: MatDialogRef<DeleteInfoMessageComponent>;

  // categories: Category[] = [];
  categories: {
    categoryId: number;
    name: string;
    active: string;
  }[] = [];
  // filteredCategories: Category[] = [];
  filteredCategories: {
    categoryId: number;
    name: string;
    active: string;
  }[] = [];
  status = 'all';

  paginatedData: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems!: number;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  sortBy: string = 'categoryId';
  sortOrderIsAscending: boolean = true;

  ngOnInit(): void {
    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );

    this.categoryService.categories$
      .pipe(
        map((categories: Category[]) =>
          categories.map((category: Category) => ({
            ...category,
            active: category.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.categories = data;
        console.log(this.categories);

        this.filteredCategories = [...this.categories];
      });
    this.categoryService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });
  }

  openDialog(): void {
    this.setData(this.currentPage, this.status);
    const dialogRef = this.dialog.open(DialogueBoxComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: 'Add',
      },
    });
  }

  confirmMessage(categoryId: Category['categoryId']) {
    this.dialogRef = this.dialog.open(DeleteInfoMessageComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategory(categoryId);
      }
      this.dialogRef = undefined;
    });
  }

  update(category: CategoryView) {
    let categoryStatus = false;
    if (category.active === 'Yes') {
      categoryStatus = true;
    } else if (category.active === 'No') {
      categoryStatus = false;
    }
    this.setData(this.currentPage, this.status);
    const dialogRef = this.dialog.open(DialogueBoxComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: 'Edit',
        categoryId: category.categoryId,
        name: category.name,
        active: categoryStatus,
      },
    });
  }

  deleteCategory(categoryId: Category['categoryId']) {
    this.setData(this.currentPage, this.status);
    this.categoryService.deleteACategory(categoryId);
  }

  sortCategories(sortby: string) {
    if (this.sortBy !== sortby) {
      this.categoryService.sortOrderIsAscending = true;
    } else {
      this.sortOrderIsAscending = !this.sortOrderIsAscending;
      this.categoryService.sortOrderIsAscending = this.sortOrderIsAscending;
    }

    this.sortBy = sortby;
    this.categoryService.sortBy = sortby;
    this.currentPage = 1;

    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      10,
      this.status
    );

    this.categoryService.categories$
      .pipe(
        map((categories: Category[]) =>
          categories.map((category: Category) => ({
            ...category,
            active: category.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.categories = data;
        console.log(this.categories);

        this.filteredCategories = [...this.categories];
      });
    this.categoryService.totalItems$.subscribe((value) => {
      this.totalItems = value;
    });
  }

  filterCategories(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    if (selectedValue === 'all') {
      this.status = 'all';
      this.categoryService.getPaginatedCategoriesFromApi(
        this.currentPage,
        this.itemsPerPage,
        this.status
      );
      this.categoryService.categories$
        .pipe(
          map((categories: Category[]) =>
            categories.map((category: Category) => ({
              ...category,
              active: category.active ? 'Yes' : 'No',
            }))
          )
        )
        .subscribe((data) => {
          this.categories = data;
          console.log(this.categories);

          this.filteredCategories = [...this.categories];
        });
      this.categoryService.totalItems$.subscribe((value) => {
        this.totalItems = value;
      });
    } else if (selectedValue === 'active') {
      this.status = 'active';
      this.categoryService.getPaginatedCategoriesFromApi(
        this.currentPage,
        this.itemsPerPage,
        'active'
      );
      this.categoryService.categories$
        .pipe(
          map((categories: Category[]) =>
            categories.map((category: Category) => ({
              ...category,
              active: category.active ? 'Yes' : 'No',
            }))
          )
        )
        .subscribe((data) => {
          this.categories = data;
          console.log(this.categories);

          this.filteredCategories = [...this.categories];
        });
      this.categoryService.totalItems$.subscribe((value) => {
        this.totalItems = value;
      });
    } else if (selectedValue === 'inactive') {
      this.status = 'inactive';
      this.categoryService.getPaginatedCategoriesFromApi(
        this.currentPage,
        this.itemsPerPage,
        this.status
      );
      this.categoryService.categories$
        .pipe(
          map((categories: Category[]) =>
            categories.map((category: Category) => ({
              ...category,
              active: category.active ? 'Yes' : 'No',
            }))
          )
        )
        .subscribe((data) => {
          this.categories = data;
          console.log(this.categories);

          this.filteredCategories = [...this.categories];
        });
      this.categoryService.totalItems$.subscribe((value) => {
        this.totalItems = value;
        console.log(this.totalItems);
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.categoryService.categories$
      .pipe(
        map((categories: Category[]) =>
          categories.map((category: Category) => ({
            ...category,
            active: category.active ? 'Yes' : 'No',
          }))
        )
      )
      .subscribe((data) => {
        this.categories = data;
        console.log(this.categories);

        this.filteredCategories = [...this.categories];
      });
  }

  ngOnDestroy() {
    console.log('category componente getting destroyed.');
  }

  setData(page: number, status: string) {
    this.categoryService.page = this.currentPage;
    this.categoryService.status = status;
  }

  fetchResults(event: Event) {
    const inputSearchElement = document.getElementById(
      'search-categories'
    ) as HTMLInputElement;
    console.log(inputSearchElement.value);

    this.currentPage = 1;

    this.categoryService.ifNameFilter = true;
    this.categoryService.categoryNameFromSearchFilter =
      inputSearchElement.value;

    fromEvent(inputSearchElement, 'input')
      .pipe(
        debounceTime(300),
        map((event: Event) => (event.target as HTMLInputElement).value),
        tap(() => {
          this.categoryService.getPaginatedCategoriesFromApi(
            this.currentPage,
            this.itemsPerPage,
            this.status
          );
        }),
        switchMap((searchText) =>
          this.categoryService.categories$.pipe(
            map((categories: Category[]) =>
              categories
                .map((category: Category) => ({
                  categoryId: category.categoryId,
                  name: category.name,
                  active: category.active ? 'Yes' : 'No',
                }))
                .filter((category) =>
                  category.name.toLowerCase().includes(searchText.toLowerCase())
                )
            )
          )
        )
      )
      .subscribe((data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
      });
  }
}
