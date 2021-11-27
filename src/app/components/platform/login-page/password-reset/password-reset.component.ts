import {Component} from '@angular/core';
import {ResetPasswordApiService} from '../../../../services/api/reset-password-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {

  constructor(private resetPasswordApiService: ResetPasswordApiService,
              private matSnackBar: MatSnackBar,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  onResetClicked(input: HTMLInputElement) {
    const key = this.activeRoute.snapshot.queryParamMap.get('key');
    this.resetPasswordApiService.resetPassword(input.value, key)
      .subscribe(() => this.matSnackBar.open('Password changed', 'Login now')
      .onAction()
      .subscribe(() => this.router.navigate(['login'])));
  }
}
