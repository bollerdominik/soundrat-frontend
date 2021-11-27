import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsPageComponent } from './terms-page.component';

const routes: Routes = [{ path: '', component: TermsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsPageRoutingModule { }
