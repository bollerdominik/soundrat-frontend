import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DiscoverPageComponent} from './discover-page.component';

const routes: Routes = [
  {
    path: '',
    component: DiscoverPageComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscoverRoutingModule {
}
