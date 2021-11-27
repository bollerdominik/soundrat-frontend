import {Component, OnInit} from '@angular/core';
import {CommentResponse, ContextTypeRequest, TrackResponse, UserResponse} from '../../../api';
import {TrackApiService} from '../../../services/api/track-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserApiService} from '../../../services/api/user-api.service';
import {switchMap, tap} from 'rxjs/operators';
import {CommentApiService} from '../../../services/api/comment-api.service';
import {CanEdit} from '../../shared/can-edit';
import {AuthService} from '../../../services/auth.service';
import {Title} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FileUrlPipe} from '../../../pipes/file-url.pipe';
import {LikesService} from '../../../services/likes.service';

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.scss']
})
export class TrackPageComponent extends CanEdit implements OnInit {
  public track: TrackResponse;
  public comments$: Observable<CommentResponse[]>;
  user: UserResponse;

  readonly TRACK_CONTEXT: ContextTypeRequest = 'TRACK';
  liked: boolean;

  constructor(private trackApiService: TrackApiService,
              private userApiService: UserApiService,
              private commentApiService: CommentApiService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private fileUrlPipe: FileUrlPipe,
              private titleService: Title,
              private likesService: LikesService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const trackRoute = params.get('trackRoute');
        const userRoute = params.get('userRoute');
        const track = history.state.track;
        return track ? of(track) : this.trackApiService.getTrack(userRoute, trackRoute);
      }),
      tap(track => this.track = track),
      tap(track => this.loadComments(track)),
      tap(track => this.titleService.setTitle(track.title + ' by ' + track.user + ' - Support on SoundRat')),
      switchMap(() => this.userApiService.getUser(this.activatedRoute.snapshot.paramMap.get('userRoute'))),
      tap(user => this.user = user),
      switchMap(() => this.likesService.likesTrack(this.track)),
      tap(liked => this.liked = liked),
      switchMap(() => this.authService.currentUser$)
    ).subscribe(currentUser => this.checkUserCanEdit(this.user, currentUser));
  }

  loadComments(track: TrackResponse) {
    this.comments$ = this.commentApiService.getCommentsForTrack(track.id);
  }

  onEditTrackClicked() {
    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute
    });
  }

  onDownloadButtonClicked() {
    if (this.authService.isAuthenticated()) {
      this.trackApiService.downloadTrack(this.track.id)
        .subscribe(value => window.open(this.fileUrlPipe.transform(value.file))
          , error => this.snackBar.open(error.error.message, null, {duration: 5000}));
    } else {
      this.router.navigate(['register'], {queryParams: {from: this.router.url}});
    }
  }

  onLikeClicked(currentlyLiked: boolean) {
    if (!currentlyLiked) {
      this.likesService.addLike(this.track, null);
    } else {
      this.likesService.removeLike(this.track, null);
    }
  }
}
