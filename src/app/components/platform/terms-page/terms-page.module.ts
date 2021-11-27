import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsPageRoutingModule } from './terms-page-routing.module';
import { TermsPageComponent } from './terms-page.component';


@NgModule({
  declarations: [TermsPageComponent],
  imports: [
    CommonModule,
    TermsPageRoutingModule
  ]
})
export class TermsPageModule { }
