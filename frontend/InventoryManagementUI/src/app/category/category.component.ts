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

@Component({
  selector: 'app-category',
  imports: [NgFor, FormsModule, PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  dialogRef?: MatDialogRef<DeleteInfoMessageComponent>;

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  status = 'all';

  paginatedData: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems!: number;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  isAscendingId: boolean = true;
  isAscendingName: boolean = true;
  sortBy: string = 'categoryId';
  sortOrderIsAscending: boolean = true;

  ngOnInit(): void {
    // this.categoryService.getCategoriesFromApi();
    // this.categoryService.categories$.subscribe(
    //   (data) => {
    //     this.categories = data;
    //     this.filteredCategories = [...this.categories];
    //   }
    // );
    // this.filteredCategories = this.categories;
    this.categoryService
      .getCategoriesCount()
      .subscribe((data) => (this.totalItems = data));
    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.categoryService.categories$.subscribe((data) => {
      this.categories = data;
      console.log(this.categories);

      this.filteredCategories = [...this.categories];
    });
    this.categoryService.totalItems$.subscribe((total) => {
      this.totalItems = total;
    });
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
        // do confirmation actions
        this.deleteCategory(categoryId);
      }
      this.dialogRef = undefined;
    });
  }

  update(category: Category) {
    this.setData(this.currentPage, this.status);
    const dialogRef = this.dialog.open(DialogueBoxComponent, {
      width: '50%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: 'Edit',
        categoryId: category.categoryId,
        name: category.name,
        active: false,
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
    }

    this.sortBy = sortby;
    this.sortOrderIsAscending = !this.sortOrderIsAscending;
    this.categoryService.sortBy = sortby;
    this.categoryService.sortOrderIsAscending = this.sortOrderIsAscending;
    this.currentPage = 1;

    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      10,
      this.status
    );

    this.categoryService.categories$.subscribe((data) => {
      this.categories = data;
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
      this.categoryService.categories$.subscribe((data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
      });
      this.categoryService.totalItems$.subscribe((value) => {
        this.totalItems = value;
      });
      // this.filteredCategories = this.categories;
      // this.fetchData();
    } else if (selectedValue === 'active') {
      this.status = 'active';
      this.categoryService.getPaginatedCategoriesFromApi(
        this.currentPage,
        this.itemsPerPage,
        'active'
      );
      this.categoryService.categories$.subscribe((data) => {
        this.categories = data;
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
      this.categoryService.categories$.subscribe((data) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
      });
      this.categoryService.totalItems$.subscribe((value) => {
        this.totalItems = value;
        console.log(this.totalItems);
      });
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

    this.categoryService.getPaginatedCategoriesFromApi(
      this.currentPage,
      this.itemsPerPage,
      this.status
    );
    this.categoryService.categories$.subscribe((data) => {
      this.categories = data;
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
    // this.setData(this.currentPage, this.status);
    const inputSearchElement = document.getElementById(
      'search-categories'
    ) as HTMLInputElement;
    console.log(inputSearchElement.value);

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
            map((categories) =>
              categories.filter((category) =>
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
