import {ElementRef, Injectable} from '@angular/core';
import {PlayerStatus} from './player-status';
import {ContextTypeRequest, TrackResponse} from '../api';
import {FileUrlPipe} from '../pipes/file-url.pipe';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PlayerState} from './player-state';
import {SongAction} from './song-action';
import {PlaylistApiService} from './api/playlist-api.service';
import {PlayerProgress} from './player-progress';
import {ListensApiService} from './api/listens-api.service';
import Hls from 'hls.js';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private audioElement: ElementRef<HTMLAudioElement>;
  private hls = new Hls();

  private playlist: TrackResponse[] = [];

  private status: PlayerStatus = PlayerStatus.STOPPED;
  private currentTrack: TrackResponse;

  private playerState = new BehaviorSubject<PlayerState>({
    track: null,
    status: this.status,
    progress: {passedTime: 0, timestamp: 0}
  });
  playerState$: Observable<PlayerState> = this.playerState.asObservable();

  constructor(private fileUrlPipe: FileUrlPipe, private playlistApiService: PlaylistApiService,
              private listensApiService: ListensApiService) {
  }

  initiate(audioElement: ElementRef<HTMLAudioElement>): void {
    this.audioElement = audioElement;
    this.audioElement.nativeElement.onended = () => this.playNext();
  }

  playNext(): void {
    const nextSong = this.getNextTrack();
    if (nextSong) {
      this.play(nextSong);
    } else {
      this.pause();
    }
  }

  playPrevious(): void {
    const previousSong = this.getPreviousTrack();
    if (previousSong) {
      this.play(previousSong);
    } else {
      this.pause();
    }
  }

  setCurrentTime(currentTime: number): void { // FIXME: Merge with dispatch? Then SongAction and PlayerState will be the same thing?
    this.audioElement.nativeElement.currentTime = currentTime;
    this.playerState.next({track: this.currentTrack, status: this.status, progress: this.getProgress()});
  }

  dispatch(action: SongAction): void {
    switch (action.status) {
      case PlayerStatus.PLAYING:
        if (!action.track || this.isSongWithStatus(action.track, [PlayerStatus.PAUSED])) {
          this.resume();
        } else {
          this.play(action.track);
        }
        break;
      case PlayerStatus.PAUSED:
        this.pause();
        break;
      case PlayerStatus.STOPPED:
        this.stop();
        break;
    }

    if (action.context) {
      this.getPlaylist(action).subscribe(playlist => this.playlist = playlist);
    }
  }

  private getPlaylist(songAction: SongAction): Observable<TrackResponse[]> {
    if (songAction.context.type === 'TRACK') {
      return of([songAction.track]);
    }
    return this.fetchPlaylist(songAction.context.type, songAction.context.userRoute, songAction.context.collectionRoute);
  }

  private fetchPlaylist(type: ContextTypeRequest, userRoute: string, collectionRoute: string): Observable<TrackResponse[]> {
    return this.playlistApiService.get(type, userRoute, collectionRoute);
  }

  private getProgress(): PlayerProgress {
    return {passedTime: this.getCurrentTime(), timestamp: Date.now()};
  }

  private getCurrentTime(): number {
    return this.audioElement.nativeElement.currentTime;
  }

  private isSongWithStatus(track: TrackResponse, playerStatus: PlayerStatus[]): boolean {
    return playerStatus.some(status => status === this.status)
      && (track.id === this.currentTrack?.id)
      && (track.trackCollectionId === this.currentTrack?.trackCollectionId);
  }

  private getNextTrack(): TrackResponse {
    const playingSongIndex = this.getPlayingSongIndex();
    return this.playlist[playingSongIndex + 1] || null;
  }

  private getPreviousTrack(): TrackResponse {
    const playingSongIndex = this.getPlayingSongIndex();
    return this.playlist[playingSongIndex - 1] || null;
  }

  private getPlayingSongIndex(): number {
    return this.playlist.findIndex(track => track.id === this.currentTrack.id &&
      track.trackCollectionId === this.currentTrack.trackCollectionId);
  }

  private play(song: TrackResponse): void {
    this.setCurrentTime(0)

    if (Hls.isSupported()) {
      this.hls.destroy();
      this.hls = null;
      this.hls = new Hls({});
      this.hls.loadSource(this.fileUrlPipe.transform(song.url));
      this.hls.attachMedia(this.audioElement.nativeElement);
      this.hls.once(Hls.Events.MANIFEST_PARSED, () => {
        this.playAudioElement(song);
      });
    } else {
      this.audioElement.nativeElement.src = this.fileUrlPipe.transform(song.url);
      this.playAudioElement(song);
    }
  }

  private playAudioElement(song: TrackResponse) {
    this.audioElement.nativeElement.play().then(() => {
      this.status = PlayerStatus.PLAYING;
      const previousTrackId: number = this.currentTrack ? this.currentTrack.id : 0;
      this.currentTrack = song;
      this.setMediaSession(song);
      this.playerState.next({track: this.currentTrack, status: this.status, progress: this.getProgress()});
      this.listensApiService.addListen({
        previous: previousTrackId,
        track: this.currentTrack.id
      }).subscribe(() => {
      });
    });
  }

  private resume(): void {
    this.audioElement.nativeElement.play()
      .then(() => {
        this.status = PlayerStatus.PLAYING;
        this.playerState.next({track: this.currentTrack, status: this.status, progress: this.getProgress()});
      });
  }

  private pause(): void {
    this.audioElement.nativeElement.pause();
    this.status = PlayerStatus.PAUSED;
    this.playerState.next({track: this.currentTrack, status: this.status, progress: this.getProgress()});
  }

  private stop(): void {
    this.status = PlayerStatus.STOPPED;
    this.playlist = [];
    this.playerState.next({track: null, status: this.status, progress: {passedTime: 0, timestamp: 0}});
  }

  private setMediaSession(track: TrackResponse): void {
    if ('mediaSession' in navigator) {
      // @ts-ignore
      const mediaSession = navigator.mediaSession;
      // @ts-ignore
      mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.user,
        artwork: [
          {src: this.fileUrlPipe.transform(track.coverFile)}]
      });

      mediaSession.setActionHandler('play', () => this.resume());
      mediaSession.setActionHandler('pause', () => this.pause());
      mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
      mediaSession.setActionHandler('nexttrack', () => this.playNext());
    }
  }
}
