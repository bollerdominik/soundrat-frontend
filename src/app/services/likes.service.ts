import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {MeApiService} from './api/me-api.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CreateLikeRequest, PostResponse, TrackCollectionResponse, TrackResponse} from '../api';
import {switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private likes = new BehaviorSubject<PostResponse[]>([]);
  private likes$: Observable<PostResponse[]> = this.likes.asObservable();

  constructor(private authService: AuthService,
              private matSnackBar: MatSnackBar,
              private router: Router,
              private meApiService: MeApiService) {


    authService.currentUser$.pipe(
      switchMap(value => value ? this.meApiService.getLikes() : of([])))
      .subscribe(value => this.likes.next(value));
  }

  private static getCreateLikeRequest(track: TrackResponse, trackCollection: TrackCollectionResponse): CreateLikeRequest {
    if (track) {
      return {
        id: track.id,
        postType: 'TRACK'
      };
    }
    if (trackCollection) {
      return {
        id: trackCollection.id,
        postType: 'COLLECTION'
      };
    }

    return null;
  }

  likesTrack(trackResponse: TrackResponse): Observable<boolean> {
    return this.likes$.pipe(switchMap(value => {
      return of(value.find(v => v.track?.id === trackResponse.id) !== undefined);
    }));
  }

  likesCollection(trackCollection: TrackCollectionResponse): Observable<boolean> {
    return this.likes$.pipe(switchMap(value => {
      return of(value.find(v => v.trackCollection?.id === trackCollection.id) !== undefined);
    }));
  }

  addLike(track: TrackResponse, trackCollection: TrackCollectionResponse) {
    if (!this.authService.isAuthenticated()) {
      this.matSnackBar.open('Login to like this post ❤️', 'Login', {duration: 4000})
        .onAction()
        .subscribe(() => this.router.navigate(['login']));
      return;
    }

    this.meApiService.addLike(LikesService.getCreateLikeRequest(track, trackCollection))
      .subscribe(() => {
        const value = this.likes.getValue();
        value.push({
          track,
          trackCollection,
          video: null,
          createDate: null,
        });
        this.likes.next(value);
      });
  }

  removeLike(track: TrackResponse, trackCollection: TrackCollectionResponse) {
    this.meApiService.removeLike(LikesService.getCreateLikeRequest(track, trackCollection))
      .subscribe(() => {
        const value = this.likes.getValue();
        if (track) {
          value.splice(value.findIndex(value1 => value1.track?.id === track.id));
        }
        if (trackCollection) {
          value.splice(value.findIndex(value1 => value1.trackCollection?.id === trackCollection.id));
        }
        this.likes.next(value);
      });
  }
}
