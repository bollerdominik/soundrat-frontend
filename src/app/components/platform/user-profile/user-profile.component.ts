import {Component, OnInit} from '@angular/core';
import {ContextTypeRequest, PostResponse, SocialMediaResponse, UserResponse} from '../../../api';
import {UserApiService} from '../../../services/api/user-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {switchMap, tap} from 'rxjs/operators';
import {SocialMediaApiService} from '../../../services/api/social-media-api.service';
import {UserEditDialogComponent} from './user-edit-dialog/user-edit-dialog.component';
import {SupportService} from '../../../services/support.service';
import {CanEdit} from '../../shared/can-edit';
import {Title} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FollowingsService} from '../../../services/followings.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends CanEdit implements OnInit {

  public posts$: Observable<PostResponse[]>;
  public supporters$: Observable<UserResponse[]>;
  public user: UserResponse;
  public socialMediaLinks: SocialMediaResponse[];
  public following = false;

  readonly ALL_TRACKS_CONTEXT: ContextTypeRequest = 'ALL_TRACKS_OF_ARTIST';
  readonly ALL_COLLECTIONS_CONTEXT: ContextTypeRequest = 'ALL_COLLECTIONS_OF_ARTIST';

  constructor(private userApiService: UserApiService,
              private socialMediaApiService: SocialMediaApiService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService,
              private router: Router,
              private matSnackBar: MatSnackBar,
              private followingsService: FollowingsService,
              private titleService: Title,
              private supportService: SupportService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const userRoute = params.get('userRoute');
        this.posts$ = this.userApiService.getUserPosts(userRoute);
        this.supporters$ = this.userApiService.getUserSupporters(userRoute);
        const user = history.state.user;
        return user ? of(user) : this.userApiService.getUser(userRoute);
      }),
      tap(user => this.user = user),
      tap(user => this.titleService.setTitle(user.name + ' - Support on SoundRat')),
      switchMap(user => this.socialMediaApiService.getSocialMediaLinks(user.id)),
      tap(socialMediaLinks => this.socialMediaLinks = socialMediaLinks),
      switchMap(() => this.followingsService.followsUser(this.user)),
      tap(following => this.following = following),
      switchMap(() => this.authService.currentUser$)
    ).subscribe(currentUser => this.checkUserCanEdit(this.user, currentUser));
  }

  onFollowClicked() {
    if (this.authService.isAuthenticated()) {
      if (this.following) {
        this.followingsService.removeFollowing(this.user);
      } else {
        this.followingsService.addFollowing(this.user);
      }
    } else {
      this.router.navigate(['register'], {queryParams: {from: this.router.url}});
    }
  }

  onSupportClicked() {
    this.supportService.openSupportDialog(this.user);
  }

  onEditButtonClicked() {
    this.dialog.open(UserEditDialogComponent, {
      data: {
        user: this.user,
        socialMedia: this.socialMediaLinks
      }
    }).afterClosed().subscribe(userRoute => {
      if (userRoute) {
        this.router.navigate([userRoute]);
        this.matSnackBar.open('Changes saved successfully. Refresh page');
      }
    });
  }
}
