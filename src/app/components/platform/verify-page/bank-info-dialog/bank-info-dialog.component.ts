import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserResponse} from '../../../../api';

@Component({
  selector: 'app-bank-info-dialog',
  templateUrl: './bank-info-dialog.component.html',
  styleUrls: ['./bank-info-dialog.component.scss']
})
export class BankInfoDialogComponent {

  public user: UserResponse;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
  }
}
