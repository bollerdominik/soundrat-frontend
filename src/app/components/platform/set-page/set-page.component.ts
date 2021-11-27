import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../../services/player.service';
import {CommentResponse, TrackCollectionResponse, UserResponse} from '../../../api';
import {CollectionApiService} from '../../../services/api/collection-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserApiService} from '../../../services/api/user-api.service';
import {switchMap, tap} from 'rxjs/operators';
import {CommentApiService} from '../../../services/api/comment-api.service';
import {Title} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {CanEdit} from '../../shared/can-edit';
import {AuthService} from '../../../services/auth.service';
import {LikesService} from '../../../services/likes.service';

@Component({
  selector: 'app-set-page',
  templateUrl: './set-page.component.html',
  styleUrls: ['./set-page.component.scss']
})
export class SetPageComponent extends CanEdit implements OnInit {
  public trackCollection: TrackCollectionResponse;
  public user: UserResponse;
  public comments$: Observable<CommentResponse[]>;
  public liked = false;

  constructor(private playerService: PlayerService,
              private collectionApiService: CollectionApiService,
              private userApiService: UserApiService,
              private commentApiService: CommentApiService,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private authService: AuthService,
              private matDialog: MatDialog,
              private likesService: LikesService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const userRoute = params.get('userRoute');
        const setRoute = params.get('setRoute');
        const trackCollection = history.state.trackCollection;
        return trackCollection ? of(trackCollection) : this.collectionApiService.getCollection(userRoute, setRoute);
      }),
      tap(trackCollection => this.trackCollection = trackCollection),
      tap(trackCollection => this.loadComments(trackCollection)),
      tap(trackCollection => this.titleService.setTitle(trackCollection.title + ' by ' + trackCollection.user + ' - Support on SoundRat')),
      switchMap(() => this.userApiService.getUser(this.activatedRoute.snapshot.paramMap.get('userRoute'))),
      tap(user => this.user = user),
      switchMap(() => this.likesService.likesCollection(this.trackCollection)),
      tap(liked => this.liked = liked),
      switchMap(() => this.authService.currentUser$)
    ).subscribe(currentUser => this.checkUserCanEdit(this.user, currentUser));

  }

  loadComments(trackCollection: TrackCollectionResponse) {
    this.comments$ = this.commentApiService.getCommentsForCollection(trackCollection.id);
  }

  onEditClicked() {
    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute
    });
  }

  onLikeClicked(currentlyLiked: boolean) {
    if (!currentlyLiked) {
      this.likesService.addLike(null, this.trackCollection);
    } else {
      this.likesService.removeLike(null, this.trackCollection);
    }
  }
}
