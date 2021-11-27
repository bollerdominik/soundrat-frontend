import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TrackResponse} from '../../../api';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyricsComponent implements OnInit {

  @Input()
  track: TrackResponse;

  collapsed = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
