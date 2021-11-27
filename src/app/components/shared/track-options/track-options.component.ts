import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ClipboardService} from '../../../services/clipboard.service';

@Component({
  selector: 'app-track-options',
  templateUrl: './track-options.component.html',
  styleUrls: ['./track-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackOptionsComponent {

  @Input()
  showEdit = false;

  @Input()
  liked = false;

  @Input()
  showDownload = true;

  @Output() readonly downloadClicked = new EventEmitter<void>();

  @Output() readonly editClicked = new EventEmitter<void>();

  @Output() readonly likeClicked = new EventEmitter<boolean>();

  constructor(private clipBoardService: ClipboardService) {
  }

  onShareButtonClicked() {
    // @ts-ignore
    if (navigator.share) {
      // @ts-ignore
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).then(() => {
      });
    } else {
      this.clipBoardService.copy(window.location.href);

    }
  }

  onEditClicked() {
    this.editClicked.emit();
  }

  onDownloadButtonClicked() {
    this.downloadClicked.emit();
  }

  onLikeClicked() {
    this.likeClicked.emit(this.liked);
  }
}
