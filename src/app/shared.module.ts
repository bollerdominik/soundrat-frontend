import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FileUrlPipe} from './pipes/file-url.pipe';
import {MatButtonModule} from '@angular/material/button';
import {UserAvatarComponent} from './components/shared/user-avatar/user-avatar.component';
import {CommonModule} from '@angular/common';
import {DateAgoPipe} from './pipes/date-ago.pipe';
import {AlertComponent} from './components/shared/alert/alert.component';
import {ImageComponent} from './components/shared/image/image.component';
import {ColorArrayPipe} from './pipes/color-array.pipe';

@NgModule({
  declarations: [
    FileUrlPipe,
    DateAgoPipe,
    UserAvatarComponent,
    ImageComponent,
    AlertComponent,
    ColorArrayPipe
  ],
  imports: [
    MatButtonModule,
    CommonModule,
  ],
  providers: [
    FileUrlPipe,
    DateAgoPipe,
    ColorArrayPipe
  ],
  exports: [
    FileUrlPipe,
    DateAgoPipe,
    ColorArrayPipe,
    ImageComponent,
    MatButtonModule,
    UserAvatarComponent,
    AlertComponent
  ],
  bootstrap: [AppComponent]
})
export class SharedModule {
}
