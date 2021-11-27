import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {PlayerService} from '../../../services/player.service';
import {PlayerStatus} from '../../../services/player-status';
import {TrackResponse} from '../../../api';
import {timer} from 'rxjs';

@Component({
  selector: 'app-footer-player',
  templateUrl: './footer-player.component.html',
  styleUrls: ['./footer-player.component.scss']
})
export class FooterPlayerComponent implements OnInit, AfterViewInit {

  static readonly SMALL_SCREEN_SIZE_THRESHOLD = 501; // FIXME: Move somewhere it belongs; also used in Wave!

  @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

  track: TrackResponse;
  status: PlayerStatus;
  showVolumeSlider = false;
  progress = 0;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.playerService.playerState$.subscribe(playerState => {
      this.track = playerState.track;
      this.status = playerState.status;
    });
  }

  ngAfterViewInit(): void {
    this.playerService.initiate(this.audioElement);
    timer(0, 200)
      .subscribe(() => {
        const num = this.getCurrentSeconds() / this.getTotalTime() * 100
        this.progress =  Math.round((num + Number.EPSILON) * 100) / 100
      });
  }

  onPlayClicked(): void {
    this.playerService.dispatch({status: PlayerStatus.PLAYING});
  }

  onPauseClicked(): void {
    this.playerService.dispatch({status: PlayerStatus.PAUSED});
  }

  onProgressChanged(progress: number): void {
    const currentTime = this.track.duration * (progress / 100);
    this.playerService.setCurrentTime(currentTime);
  }

  onPlayNextClicked(): void {
    this.playerService.playNext();
  }

  onPlayPreviousClicked(): void {
    this.playerService.playPrevious();
  }

  onVolumeChanged(change: MatSliderChange): void {
    this.audioElement.nativeElement.volume = change.value / 100;
  }

  isSmallScreen(): boolean {
    return window.outerWidth < FooterPlayerComponent.SMALL_SCREEN_SIZE_THRESHOLD;
  }

  isPlaying(): boolean {
    return this.status === PlayerStatus.PLAYING;
  }

  getProgress(): number {
    return this.progress;
  }

  getCurrentSeconds(): number {
    return this.audioElement.nativeElement.currentTime * 1000;
  }

  getTotalTime(): number {
    return this.audioElement.nativeElement.duration * 1000;
  }
}
