import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {fromEvent, Subscription, timer} from 'rxjs';
import {FooterPlayerComponent} from '../../footer-player/footer-player.component';
import {WaveService} from './wave.service';
import {throttleTime} from 'rxjs/operators';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveformComponent implements OnInit, OnChanges, OnDestroy {

  @Input() set playing(playing: boolean) {
    this.handleWaveUpdateSubscription(playing);
  }

  @Input() inactive: boolean;
  @Input() currentTime: number;
  @Input() totalTime: number;
  @Input() waveInput: number[];

  @Output() readonly currentTimeChange = new EventEmitter<number>();

  @ViewChild('progressCanvas', {static: true}) progressCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas', {static: true}) backgroundCanvas: ElementRef<HTMLCanvasElement>;

  progress: number;
  mouseOverXPosition: number;

  private waveUpdateSubscription: Subscription;

  constructor(private elementRef: ElementRef,
              private waveService: WaveService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initCanvas();
    this.progress = this.getProgress();
    this.renderWave();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentTime && changes.currentTime.currentValue) {
      this.progress = this.getProgress(changes.currentTime.currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.waveUpdateSubscription) {
      this.waveUpdateSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.initCanvas();
    this.renderWave();
  }

  onMouseOver(xCoordinate: number): void {
    if (this.inactive) {
      return;
    }
    const rect = this.progressCanvas.nativeElement.getBoundingClientRect();
    this.mouseOverXPosition = xCoordinate - rect.left;
    this.changeDetectorRef.markForCheck();
  }

  onMouseOut(): void {
    this.mouseOverXPosition = null;
    this.changeDetectorRef.markForCheck();
  }

  onProgressChanged(xCoordinate: number): void { // FIXME: Simplify calculation ;)
    const rect = this.progressCanvas.nativeElement.getBoundingClientRect();
    if (rect.left === 0) {
      this.currentTimeChange.emit(0);
      return;
    }
    const x = xCoordinate - rect.left;
    const progress = Math.round((x / this.progressCanvas.nativeElement.width) * 100);
    const currentTime = this.totalTime * (progress / 100);
    this.currentTimeChange.emit(currentTime);
  }

  private renderWave(): void {
    const width = this.getCanvasWidth();
    const height = this.getCanvasHeight();
    const waveData = this.waveService.processWave(this.waveInput, width);
    this.waveService.drawWave(this.backgroundCanvas.nativeElement.getContext('2d'), waveData, width, height, '#ffffff');
    this.waveService.drawWave(this.progressCanvas.nativeElement.getContext('2d'), waveData, width, height, '#ff4081');
  }

  private handleWaveUpdateSubscription(playing: boolean): void {
    if (this.waveUpdateSubscription) {
      this.waveUpdateSubscription.unsubscribe();
    }
    if (playing) {
      this.waveUpdateSubscription = timer(0, 500).subscribe(() => {
        this.currentTime += 0.5;
        this.progress = this.getProgress();
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  private initCanvas(): void {
    this.progressCanvas.nativeElement.width = this.getCanvasWidth();
    this.progressCanvas.nativeElement.height = this.getCanvasHeight();

    this.backgroundCanvas.nativeElement.width = this.getCanvasWidth();
    this.backgroundCanvas.nativeElement.height = this.getCanvasHeight();

    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousemove')
      .pipe(throttleTime(50))
      .subscribe(event => this.onMouseOver(event.clientX)); // NOTE: Too lazy to unsubscribe since target will be lost on destroy
  }

  private getCanvasWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  private getCanvasHeight(): number {
    return window.outerWidth < FooterPlayerComponent.SMALL_SCREEN_SIZE_THRESHOLD ? 40 : 56;
  }

  private getProgress(currentTime = this.currentTime): number {
    const progress = (100 / this.totalTime) * currentTime;
    return isNaN(progress) ? 0 : Math.min(progress, 100);
  }
}
