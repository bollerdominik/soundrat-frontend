import {Injectable} from '@angular/core';
import {SupportDialogComponent} from '../components/shared/support/support-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SubscriptionResponse, UserResponse} from '../api';
import {SubscriptionApiService} from './api/subscription-api.service';
import {filter, switchMap} from 'rxjs/operators';
import {SupportServiceModule} from './SupportServiceModule';

@Injectable({
  providedIn: SupportServiceModule
})
export class SupportService {
  private subscriptions: SubscriptionResponse[];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private subscriptionApiService: SubscriptionApiService
  ) {
    if (authService.isAuthenticated()) {
      this.loadActiveSubscriptions();
    }
  }

  openSupportDialog(artist: UserResponse): void {
      if (this.currentUserSupportsArtist(artist)) {
        this.snackBar.open(
          'You are already supporting ' + artist.name,
          'Manage subscriptions',
          {duration: 3000})
          .onAction()
          .subscribe(() => this.router.navigate(['supporting']));
      } else {
        this.dialog.open(SupportDialogComponent, SupportDialogComponent.config(artist))
          .afterClosed()
          .pipe(
            filter(value => value === 'ACTIVE'),
            switchMap(() => this.subscriptionApiService.getSubscriptions()))
          .subscribe(value => this.subscriptions = value);
      }
  }

  currentUserSupportsArtist(artist: UserResponse): boolean {
    return this.subscriptions?.some(value => value.artist.id === artist.id);
  }

  loadActiveSubscriptions() {
    this.subscriptionApiService.getSubscriptions()
      .subscribe(value => this.subscriptions = value);
  }
}
