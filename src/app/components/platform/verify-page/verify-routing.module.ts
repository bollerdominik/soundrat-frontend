import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VerifyPageComponent} from './verify-page.component';
import {AuthGuard} from '../../../guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: VerifyPageComponent,
    canActivate: [AuthGuard]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyRoutingModule {
}
