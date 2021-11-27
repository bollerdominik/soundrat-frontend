import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetEditComponent } from './set-edit.component';

const routes: Routes = [{ path: '', component: SetEditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetEditRoutingModule { }
