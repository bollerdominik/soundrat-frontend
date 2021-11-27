import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegisterRoutingModule} from './register-routing.module';
import {RegisterPageComponent} from './register-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../shared.module';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [RegisterPageComponent],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        MatInputModule,
        MatCardModule
    ]
})
export class RegisterModule {
}
