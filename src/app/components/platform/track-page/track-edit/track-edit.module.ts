import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UploadModule} from '../../upload-page/upload.module';
import {TrackEditComponent} from './track-edit.component';
import {TrackEditRoutingModule} from './track-edit-routing.module';


@NgModule({
  declarations: [TrackEditComponent],
  imports: [
    CommonModule,
    TrackEditRoutingModule,
    UploadModule
  ]
})
export class TrackEditModule { }
