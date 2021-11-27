import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {VerificationApiService} from '../../../services/api/verification-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserResponse, VerificationResponse} from '../../../api';
import {switchMap} from 'rxjs/operators';
import {MatRadioChange} from '@angular/material/radio';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {BankInfoDialogComponent} from './bank-info-dialog/bank-info-dialog.component';

@Component({
  selector: 'app-verify-page',
  templateUrl: './verify-page.component.html',
  styleUrls: ['./verify-page.component.scss']
})
export class VerifyPageComponent implements OnInit {

  formGroup: FormGroup;
  waitingForBank = false;
  verification: VerificationResponse;
  edit = false;
  private currentUser: UserResponse;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private authService: AuthService,
              private verificationApiService: VerificationApiService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      payout: ['', Validators.required],
      paypalEmail: ['', Validators.email],
      name: ['', Validators.required],
      correct: ['', Validators.required],
      accept: ['', Validators.required]
    });

    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      window.history.pushState({}, document.title, '/verify');
      this.verificationApiService.addStripeCode({code})
        .pipe(switchMap(() => this.verificationApiService.getVerification()))
        .subscribe(verification =>
          this.setVerification(verification)
        );
    } else {
      this.verificationApiService.getVerification()
        .subscribe(verification =>
          this.setVerification(verification)
        );
    }

    this.authService.currentUser$
      .subscribe(currentUser => this.currentUser = currentUser);
  }

  private setVerification(verification: VerificationResponse) {
    this.verification = verification;
    this.formGroup.patchValue({payout: this.verification.payoutType});
    this.formGroup.patchValue({name: this.verification.name});
    this.formGroup.patchValue({paypalEmail: this.verification.paypalEmail});
    if (!this.verification.active && this.verification.payoutType === 'BANK') {
      this.snackBar.open('Bank account linked successfully. Please complete verification', '✔️', {duration: 3000});
    }
  }

  onBankClicked(button: HTMLButtonElement) {
    this.waitingForBank = true;
    button.innerText = 'Please complete setup in new page';

    window.open('https://connect.stripe.com/express/oauth/authorize?client_id=' +
      environment.stripeClientId +
      '&suggested_capabilities[]=card_payments&suggested_capabilities[]=transfers' +
      '&stripe_user[url]=soundrat.com/' + this.currentUser.userRoute,
      '_blank');
  }

  onSubmitButtonClicked() {
    if (!this.formGroup.valid) {
      this.snackBar.open('Please complete the verification form', null, {duration: 3000});
      return;
    }

    if (this.formGroup.get('payout').value === 'BANK' && this.verification?.payoutType !== 'BANK') {
      this.snackBar.open('Please complete the bank verification', null, {duration: 3000});
      return;
    }

    let observable;
    const request = {
      name: this.formGroup.get('name').value,
      payoutType: this.formGroup.get('payout').value,
      paypalEmail: this.formGroup.get('paypalEmail')?.value
    };
    if (this.edit) {
      observable = this.verificationApiService.editVerification(request);
    } else {
      observable = this.verificationApiService.createVerification(request);
    }

    observable.pipe(switchMap(() => this.verificationApiService.getVerification()))
      .subscribe(verification => this.verification = verification);
  }

  onPayoutTypeChange(change: MatRadioChange) {
    if (change.value === 'PAYPAL') {
      this.formGroup.setControl('paypalEmail', new FormControl('', [Validators.required, Validators.email]));
    } else {
      this.formGroup.removeControl('paypalEmail');
    }
  }

  onBankInfoClicked() {
    this.dialog.open(BankInfoDialogComponent, {data: {user: this.currentUser}});
  }

  onEditBankClicked() {
    this.verificationApiService.getDashboard()
      .subscribe(value => window.location.href = value.url,
        () => this.snackBar.open('Something went wrong. Please contact support', null, {duration: 3000}));
  }
}
