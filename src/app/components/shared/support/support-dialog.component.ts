import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {SubscriptionApiService} from '../../../services/api/subscription-api.service';
import {interval, Observable, Subscription} from 'rxjs';
import {switchMap, takeWhile, tap} from 'rxjs/operators';
import {CreateSubscriptionResponse, UserResponse} from '../../../api';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support-dialog.component.html',
  styleUrls: ['./support-dialog.component.scss']
})
export class SupportDialogComponent implements OnInit {

  public amount = 1000;
  public message = '';
  public waitingForPayment = false;
  private paymentPolling$: Subscription;

  constructor(private dialogRef: MatDialogRef<SupportDialogComponent>,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              private subscriptionApiService: SubscriptionApiService,
              @Inject(MAT_DIALOG_DATA) public artist: UserResponse) {
  }

  public static config(user: UserResponse): MatDialogConfig {
    return {disableClose: true, minWidth: 350, data: user};
  }

  ngOnInit(): void {
  }

  clickCancel() {
    if (this.paymentPolling$) {
      this.paymentPolling$.unsubscribe();
    }
    this.dialogRef.close();
  }

  clickPay() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['register'], {queryParams: {from: this.router.url, support: this.artist.name}});
      this.dialogRef.close();
      return;
    }
    this.waitingForPayment = true;
    const w = window.open('/assets/stripe.html');
    this.paymentPolling$ = this.subscriptionApiService.createSubscription({
      amount: this.amount,
      message: this.message,
      userId: this.artist.id
    }).pipe(
      tap(payResponse => w.location.assign('/assets/stripe.html?sessionId=' + payResponse.sessionId +
        '&accountId=' + this.getAccountId(payResponse))),
      switchMap(payResponse => this.pollProgress(payResponse.sessionId)),
      takeWhile(paymentStatus => paymentStatus !== 'ACTIVE', true)
    ).subscribe((paymentStatus) => {
      if (paymentStatus === 'ACTIVE') {
        // wait a second for the stripe purchase UI to show success
        setTimeout(() => {
            w.close();
            this.dialogRef.close(paymentStatus);
            this.snackBar.open(`Successful payment to ${this.artist.name}`, null, {duration: 5000});
          },
          1000);
      }
    }, error => {
      this.snackBar.open(error.error.message, null, {duration: 5000});
      w.close();
      this.dialogRef.close();
    });
  }

  private getAccountId(payResponse: CreateSubscriptionResponse): string {
    // fixme for some reason this can not be in-lined
    if (payResponse.accountId == null) {
      return 'na';
    } else {
      return payResponse.accountId;
    }
  }

  private pollProgress(sessionId: string): Observable<string> {
    return interval(1000).pipe(
      switchMap(() => this.subscriptionApiService.getPaymentStatus(sessionId))
    );
  }
}
