import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlayerService} from '../../../services/player.service';
import {PlayerStatus} from '../../../services/player-status';
import {YouTubePlayer} from '@angular/youtube-player';
import {VideoResponse} from '../../../api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('player')
  private videoPlayer: YouTubePlayer;

  @Input()
  video: VideoResponse;
  private playerSubscription: Subscription;

  // FIXME get color from image
  color: number[] = [141, 77, 173];

  constructor(private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.playerSubscription = this.playerService.playerState$.subscribe(value => {
      if (value.status === PlayerStatus.PLAYING && this.videoPlayer) {
        this.videoPlayer.pauseVideo();
      }
    });

    const elementById = document.getElementById('youtube-script');
    if (!elementById) {
      const tag = document.createElement('script');
      tag.id = 'youtube-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }

  onStateChange(event: YT.OnStateChangeEvent) {
    if (event.data === YT.PlayerState.PLAYING) {
      this.playerService.dispatch({status: PlayerStatus.PAUSED});
    }
  }

  ngOnDestroy(): void {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }
}
