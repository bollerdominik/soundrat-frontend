import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardPageRoutingModule} from './dashboard-page-routing.module';
import {DashboardPageComponent} from './dashboard-page.component';
import {MatCardModule} from '@angular/material/card';
import {SharedModule} from '../../../shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SupporterCardComponent} from './supporter-card/supporter-card.component';
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [DashboardPageComponent, SupporterCardComponent],
  imports: [
    CommonModule,
    DashboardPageRoutingModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ]
})
export class DashboardPageModule {
}
