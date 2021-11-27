import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SupportingRoutingModule} from './supporting-routing.module';
import {SupportingPageComponent} from './supporting-page.component';
import {SharedModule} from '../../../shared.module';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [SupportingPageComponent],
    imports: [
        CommonModule,
        SupportingRoutingModule,
        SharedModule,
        MatCardModule
    ]
})
export class SupportingModule {
}
