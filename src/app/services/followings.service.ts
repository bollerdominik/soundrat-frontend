import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {MeApiService} from './api/me-api.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UserResponse} from '../api';
import {switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FollowingsService {

  private follows = new BehaviorSubject<UserResponse[]>([]);
  private follows$: Observable<UserResponse[]> = this.follows.asObservable();

  constructor(private authService: AuthService,
              private router: Router,
              private meApiService: MeApiService) {

    authService.currentUser$.pipe(
      switchMap(value => value ? this.meApiService.getFollowings() : of([])))
      .subscribe(value => this.follows.next(value));
  }

  followsUser(user: UserResponse): Observable<boolean> {
    return this.follows$.pipe(switchMap(value => {
      return of(value.find(v => v?.id === user.id) !== undefined);
    }));
  }

  addFollowing(user: UserResponse) {
    this.meApiService.addFollowings(user).subscribe(() => {
      const value = this.follows.getValue();
      value.push(user);
      this.follows.next(value);
    });
  }

  removeFollowing(user: UserResponse) {
    this.meApiService.deleteFollowings(user).subscribe(() => {
      const value = this.follows.getValue();
      value.splice(value.findIndex(v => v?.id === user.id));
      this.follows.next(value);
    });
  }
}
