import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../../../guards/auth.guard';
import {SupportingPageComponent} from './supporting-page.component';

const routes: Routes = [{
  path: '', component: SupportingPageComponent, canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportingRoutingModule {
}
