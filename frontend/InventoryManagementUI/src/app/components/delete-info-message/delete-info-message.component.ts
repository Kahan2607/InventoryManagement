import { Component } from '@angular/core';
// import { MdDialog, MdDialogRef } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-info-message',
  imports: [],
  templateUrl: './delete-info-message.component.html',
  styleUrl: './delete-info-message.component.scss'
})
export class DeleteInfoMessageComponent {
  constructor(public dialogRef: MatDialogRef<DeleteInfoMessageComponent>) {
    
  }

  public confirmMessage:string = '';
}
