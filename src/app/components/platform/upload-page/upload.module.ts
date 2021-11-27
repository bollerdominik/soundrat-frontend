import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackUploadComponent} from './track-upload/track-upload.component';
import {AlbumUploadComponent} from './album-upload/album-upload.component';
import {UploadPageComponent} from './upload-page.component';
import {FileUrlPipe} from '../../../pipes/file-url.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared.module';
import {RouterModule} from '@angular/router';
import {UploadRoutingModule} from './upload-routing.module';

@NgModule({
  declarations: [
    TrackUploadComponent,
    UploadPageComponent,
    AlbumUploadComponent],
  imports: [
    UploadRoutingModule,
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    DragDropModule,
    FormsModule,
    MatCardModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    AlbumUploadComponent,
    TrackUploadComponent
  ],
  providers: [
    FileUrlPipe,
  ]
})
export class UploadModule {
}
