import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginPageComponent} from './login-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../shared.module';
import {MatCardModule} from '@angular/material/card';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';


@NgModule({
  declarations: [LoginPageComponent, PasswordResetRequestComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatCardModule
  ]
})
export class LoginModule {
}
