import {Component, Input, OnInit} from '@angular/core';
import {UserResponse} from '../../../api';
import {SupportService} from '../../../services/support.service';
import {FollowingsService} from '../../../services/followings.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

  @Input()
  public user: UserResponse;
  public following = false;

  constructor(private supportService: SupportService,
              private authService: AuthService,
              private router: Router,
              private followingsService: FollowingsService) {
  }

  ngOnInit() {
    this.followingsService.followsUser(this.user).subscribe(
      value => this.following = value
    );
  }

  onSupportClicked() {
    this.supportService.openSupportDialog(this.user);
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
}
