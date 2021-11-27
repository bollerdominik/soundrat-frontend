import {Component, OnInit} from '@angular/core';
import {DashboardApiService} from '../../../services/api/dashboard-api.service';
import {SupporterResponse, UserResponse} from '../../../api';
import {AuthService} from '../../../services/auth.service';
import {ClipboardService} from '../../../services/clipboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  supporters: SupporterResponse[];
  currentUser: UserResponse;

  constructor(private dashboardApiService: DashboardApiService, private authService: AuthService,
              private clipBoardService: ClipboardService) {
  }

  ngOnInit(): void {
    this.dashboardApiService.getSupporters()
      .subscribe(value => this.supporters = value);
    this.authService.currentUser$.subscribe(
      value => this.currentUser = value
    )
  }

  copyProfileLink() {
    this.clipBoardService.copy('https://soundrat.com/' + this.currentUser?.userRoute);
  }
}
