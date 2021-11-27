import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from './login-page.component';
import {PasswordResetRequestComponent} from './password-reset-request/password-reset-request.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';


const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'request-reset', component: PasswordResetRequestComponent},
  {path: 'reset', component: PasswordResetComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
