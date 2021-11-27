import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrackCollectionResponse, TrackResponse, UserResponse} from '../../../../api';
import {CommentApiService} from '../../../../services/api/comment-api.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {SupportService} from '../../../../services/support.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentCreateComponent implements OnInit {

  @Input()
  user: UserResponse;

  @Input()
  track: TrackResponse;

  @Input()
  trackCollection: TrackCollectionResponse;

  @Output() readonly reloadCommentChange = new EventEmitter<void>();

  constructor(private commentApiService: CommentApiService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router,
              private supportService: SupportService) {
  }

  ngOnInit(): void {
  }

  onCommentFieldClicked() {
    if (this.authService.isAuthenticated()) {
      if (!this.supportService.currentUserSupportsArtist(this.user)) {
        this.supportService.openSupportDialog(this.user);
      }
    } else {
      this.router.navigate(['register'], {queryParams: {from: this.router.url}});
    }
  }

  onCommentSubmitClicked(commentInput: HTMLTextAreaElement) {
    if (this.authService.isAuthenticated()) {
      if (!this.supportService.currentUserSupportsArtist(this.user)) {
        this.supportService.openSupportDialog(this.user);
      } else {
        if (this.track) {
          this.commentApiService.createCommentForTrack(this.track.id, {message: commentInput.value})
            .subscribe(() => this.handleCommentPosted(commentInput));
        } else if (this.trackCollection) {
          this.commentApiService.createCommentForCollection(this.trackCollection.id, {message: commentInput.value})
            .subscribe(() => this.handleCommentPosted(commentInput));
        }
      }
    } else {
      this.router.navigate(['register'], {queryParams: {from: this.router.url}});
    }
  }

  private handleCommentPosted(commentInput: HTMLTextAreaElement) {
    this.reloadCommentChange.emit();
    commentInput.value = '';
  }
}
