import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {SetPageComponent} from './set-page/set-page.component';
import {TrackPageComponent} from './track-page/track-page.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
  },
  {
    path: 'sets/:setRoute',
    component: SetPageComponent
  },
  {
    path: ':trackRoute',
    component: TrackPageComponent,
  },
  {
    path: 'sets/:setRoute/edit',
    loadChildren: () => import('./set-page/set-edit/set-edit.module').then(m => m.SetEditModule)
  },
  {
    path: ':trackRoute/edit',
    loadChildren: () => import('./track-page/track-edit/track-edit.module').then(m => m.TrackEditModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule {
}
