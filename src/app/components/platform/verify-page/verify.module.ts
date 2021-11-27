import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VerifyRoutingModule} from './verify-routing.module';
import {VerifyPageComponent} from './verify-page.component';
import {BankInfoDialogComponent} from './bank-info-dialog/bank-info-dialog.component';
import {SharedModule} from '../../../shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    VerifyPageComponent,
    BankInfoDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VerifyRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule
  ]
})
export class VerifyModule {
}
