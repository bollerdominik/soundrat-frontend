import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SetEditRoutingModule} from './set-edit-routing.module';
import {SetEditComponent} from './set-edit.component';
import {UploadModule} from '../../upload-page/upload.module';


@NgModule({
  declarations: [SetEditComponent],
  imports: [
    CommonModule,
    SetEditRoutingModule,
    UploadModule
  ]
})
export class SetEditModule { }
