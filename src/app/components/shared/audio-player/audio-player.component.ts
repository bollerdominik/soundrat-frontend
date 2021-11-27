import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {PlayerStatus} from '../../../services/player-status';
import {ContextTypeRequest, TrackCollectionResponse, TrackResponse} from '../../../api';
import {WaveApiService} from '../../../services/api/wave-api.service';
import {Observable, Subscription} from 'rxjs';
import {PlayerService} from '../../../services/player.service';
import {filter, map, take} from 'rxjs/operators';
import {PlayerState} from '../../../services/player-state';
import {FileLoadService} from '../../../services/file-load.service';

type AudioPlayerStatus = 'PLAYING' | 'PAUSED' | 'INACTIVE';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() track: TrackResponse;
  @Input() collection: TrackCollectionResponse;
  @Input() context: ContextTypeRequest = 'TRACK';
  @Input() eagerAudioFetch = false;

  playerStatus: AudioPlayerStatus = 'INACTIVE';
  currentTime: number;
  soundWave$: Observable<number[]>;

  private playerSubscription: Subscription;

  constructor(private playerService: PlayerService,
              private waveApiService: WaveApiService,
              private fileLoadService: FileLoadService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  private static determinePassedTime(playerState: PlayerState): number {
    if (playerState.status === PlayerStatus.PLAYING) {
      return playerState.progress.passedTime + ((Date.now() - playerState.progress.timestamp) / 1000);
    }
    return playerState.progress.passedTime;
  }

  private static trackChanged(trackChange: SimpleChange): boolean {
    return trackChange && trackChange.currentValue && trackChange.firstChange === false;
  }

  ngOnInit(): void {
    if (this.eagerAudioFetch) {
      this.onHoverTrack();
    }
    this.playerSubscription = this.playerService.playerState$.subscribe(playerState => {
      if (playerState.track && this.isSameTrack(playerState.track)) {
        this.currentTime = AudioPlayerComponent.determinePassedTime(playerState);
        this.playerStatus = playerState.status === PlayerStatus.PLAYING ? 'PLAYING' : 'PAUSED';
      } else {
        this.playerStatus = 'INACTIVE';
      }
      this.changeDetectorRef.markForCheck(); // NOTE: Necessary, because of OnPush cd strategy
    });
    this.soundWave$ = this.waveApiService.getSoundWave(this.track.url);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (AudioPlayerComponent.trackChanged(changes.track)) {
      this.determineCurrentPlayerStatus(changes.track.currentValue).subscribe(playerStatus => this.playerStatus = playerStatus);
      this.soundWave$ = this.waveApiService.getSoundWave(changes.track.currentValue.url);
    }
  }

  ngOnDestroy(): void {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }


  private determineCurrentPlayerStatus(newTrack: TrackResponse): Observable<AudioPlayerStatus> {
    return this.playerService.playerState$.pipe(
      take(1),
      filter(playerState => playerState.status !== PlayerStatus.STOPPED),
      map(playerState => {
        if (this.isSameTrack(playerState.track, newTrack)) {
          return this.playerStatus = playerState.status === PlayerStatus.PLAYING ? 'PLAYING' : 'PAUSED';
        } else {
          return this.playerStatus = 'INACTIVE';
        }
      })
    );
  }

  onPlayClicked(): void {
    this.playerService.dispatch({
      track: this.track,
      status: PlayerStatus.PLAYING,
      context: {
        type: this.context,
        userRoute: this.track.userRoute,
        collectionRoute: this.collection ? this.collection.collectionRoute : null
      }
    });
  }

  onPauseClicked(): void {
    this.playerService.dispatch({track: this.track, status: PlayerStatus.PAUSED});
  }

  onCurrentTimeChanged(currentTime: number): void {
    this.playerService.setCurrentTime(currentTime);
  }

  onWaveClicked(): void {
    if (this.playerStatus === 'INACTIVE') {
      this.onPlayClicked();
    }
  }

  getTitle(): string {
    return this.collection ? this.collection.title : this.track.title;
  }

  getLink(): string {
    return '/' + this.track.userRoute + '/' +
      (this.collection ? '/sets/' + this.collection.collectionRoute : this.track.trackRoute);
  }

  private isSameTrack(track: TrackResponse, currentTrack: TrackResponse = this.track): boolean {
    return track.id === currentTrack.id && track.trackCollectionId === currentTrack.trackCollectionId;
  }

  @HostListener('mouseover')
  onHoverTrack() {
    if (this.track) {
      this.fileLoadService.prefetchAudio(this.track.url);
    }
  }
}
