import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PersonalStreamPageComponent} from './personal-stream-page.component';
import {AuthGuard} from "../../../guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: PersonalStreamPageComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalStreamRoutingModule {
}
