import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TrackPageComponent} from './track-page/track-page.component';
import {SetPageComponent} from './set-page/set-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AudioPlayerComponent} from '../shared/audio-player/audio-player.component';
import {CollectionPlayerComponent} from '../shared/collection-player/collection-player.component';
import {SocialMediaLinksComponent} from './user-profile/social-media-links/social-media-links.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SharedModule} from '../../shared.module';
import {SupportDialogComponent} from '../shared/support/support-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {CommentCreateComponent} from '../shared/comments/comment-create/comment-create.component';
import {LyricsComponent} from '../shared/lyrics/lyrics.component';
import {CommentsComponent} from '../shared/comments/comments.component';
import {TrackOptionsComponent} from '../shared/track-options/track-options.component';
import {WaveformComponent} from '../shared/audio-player/waveform/waveform.component';
import {MatRadioModule} from '@angular/material/radio';
import {RouterModule} from '@angular/router';
import {UserEditDialogComponent} from './user-profile/user-edit-dialog/user-edit-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {PlatformRoutingModule} from './platform-routing.module';
import {ArtistComponent} from '../shared/artist/artist.component';
import {MatCardModule} from '@angular/material/card';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {VideoPlayerComponent} from '../shared/video-player/video-player.component';
import {SupportServiceModule} from '../../services/SupportServiceModule';
import {DiscoverPageComponent} from './discover-page/discover-page.component';
import {PostsComponent} from '../shared/posts/posts.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {PostFilterPipe} from "../../pipes/post-filter.pipe";
import {ColorGradientPipe} from '../../pipes/color-gradient.pipe';
import {PersonalStreamPageComponent} from "./personal-stream-page/personal-stream-page.component";


@NgModule({
  declarations: [
    SupportDialogComponent,
    CommentCreateComponent,
    LyricsComponent,
    TrackOptionsComponent,
    CommentsComponent,
    UserProfileComponent,
    TrackPageComponent,
    SetPageComponent,
    AudioPlayerComponent,
    CollectionPlayerComponent,
    SocialMediaLinksComponent,
    WaveformComponent,
    UserEditDialogComponent,
    ArtistComponent,
    VideoPlayerComponent,
    DiscoverPageComponent,
    PersonalStreamPageComponent,
    PostsComponent,
    PostFilterPipe,
    ColorGradientPipe,
  ],
  exports: [
    DiscoverPageComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatRadioModule,
    RouterModule,
    MatSelectModule,
    MatCardModule,
    PlatformRoutingModule,
    YouTubePlayerModule,
    SupportServiceModule,
    InfiniteScrollModule
  ]
})
export class PlatformModule {
}
