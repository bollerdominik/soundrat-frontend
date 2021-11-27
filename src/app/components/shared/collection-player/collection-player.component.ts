import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ContextTypeRequest, TrackCollectionResponse, TrackResponse} from '../../../api';
import {PlayerService} from '../../../services/player.service';
import {PlayerStatus} from '../../../services/player-status';
import {PlayerState} from '../../../services/player-state';
import {Subscription} from 'rxjs';
import {FileLoadService} from '../../../services/file-load.service';

@Component({
  selector: 'app-collection-player',
  templateUrl: './collection-player.component.html',
  styleUrls: ['./collection-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionPlayerComponent implements OnInit, OnDestroy {

  @Input() collection: TrackCollectionResponse;
  @Input() context: ContextTypeRequest = 'COLLECTION';

  selectedTrack: TrackResponse;

  private currentlyActive = false;
  private playerSubscription: Subscription;

  constructor(private playerService: PlayerService,
              private fileLoadService: FileLoadService) {
  }

  ngOnInit(): void {
    this.selectedTrack = this.collection.tracks[0];
    this.playerSubscription = this.playerService.playerState$.subscribe(playerState => {
      if (playerState.track && this.isTrackOfThisCollection(playerState)) {
        this.selectedTrack = this.collection.tracks.find(track => track.id === playerState.track.id) || this.selectedTrack;
        this.currentlyActive = true;
      } else {
        this.currentlyActive = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }

  private isTrackOfThisCollection(playerState: PlayerState): boolean {
    return playerState.track.trackCollectionId === this.collection.id;
  }

  isPlayingTrack(track: TrackResponse): boolean {
    return this.currentlyActive && this.selectedTrack.id === track.id;
  }

  onPlayItemClicked(track: TrackResponse): void {
    this.selectedTrack = track;
    this.playerService.dispatch({
      track,
      status: PlayerStatus.PLAYING,
      context: {
        type: this.context,
        userRoute: this.collection.userRoute,
        collectionRoute: this.collection.collectionRoute
      }
    });
  }

  onHoverTrack(track: TrackResponse) {
    this.fileLoadService.prefetchAudio(track.url);
  }
}
