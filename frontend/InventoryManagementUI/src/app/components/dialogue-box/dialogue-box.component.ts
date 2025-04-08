import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../model/category.type';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogue-box',
  imports: [
    MatFormFieldModule,
    MatCheckbox,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './dialogue-box.component.html',
  styleUrl: './dialogue-box.component.scss',
})
export class DialogueBoxComponent implements OnInit {
  inputData: any;
  addCategoryForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<DialogueBoxComponent>,
    private _formBuilder: FormBuilder,
    private _categoryService: CategoryService
  ) {
    this.addCategoryForm = this._formBuilder.group({
      name: ['', Validators.required],
      active: [false],
    });
  }

  ngOnInit(): void {
    this.inputData = this.data;
    console.log(this.inputData.title);
  }

  closeDialog() {
    this._dialogRef.close();
  }

  onSubmit() {
    if (this.addCategoryForm.valid) {
      // let categoryId = this.inputData.categoryId !== undefined ? this.inputData.categoryId : 0;
      console.log(this.inputData.categoryId);

      const newCategory: Category = {
        categoryId: this.inputData.categoryId,
        name: this.addCategoryForm.value.name,
        active: this.addCategoryForm.value.active,
      };

      if (this.inputData.title === 'Add') {
        this._categoryService.addCategoryByApi(newCategory);
      }
      if (this.inputData.title === 'Edit') {
        this._categoryService.editAndUpdateCategory(newCategory);

        // this._categoryService.getPaginatedCategoriesFromApi(this._categoryService.page, 10);
      }

      this.addCategoryForm.reset();
      this.closeDialog();
    }
  }
}
