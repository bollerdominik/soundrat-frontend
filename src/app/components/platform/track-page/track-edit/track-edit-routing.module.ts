import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackEditComponent} from './track-edit.component';


const routes: Routes = [{path: '', component: TrackEditComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackEditRoutingModule {
}
