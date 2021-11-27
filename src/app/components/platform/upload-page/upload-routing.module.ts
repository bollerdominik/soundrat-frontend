import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadPageComponent} from './upload-page.component';
import {AlbumUploadComponent} from './album-upload/album-upload.component';
import {PendingChangesGuard} from '../../../guards/pending-changes.guard';
import {AuthGuard} from '../../../guards/auth.guard';


const routes: Routes = [
  {
    path: '', component: UploadPageComponent,
    canDeactivate: [PendingChangesGuard],
    canActivate: [AuthGuard],
  }
  ,
  {
    path: 'album',
    component: AlbumUploadComponent,
    canDeactivate: [PendingChangesGuard],
    canActivate: [AuthGuard],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule {
}
