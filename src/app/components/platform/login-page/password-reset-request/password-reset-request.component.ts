import {Component} from '@angular/core';
import {ResetPasswordApiService} from '../../../../services/api/reset-password-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent {

  constructor(private resetPasswordApiService: ResetPasswordApiService,
              private matSnackBar: MatSnackBar) {
  }

  onResetClicked(input: HTMLInputElement) {
    this.resetPasswordApiService.requestReset(input.value)
      .subscribe(() => {
        this.matSnackBar.open('📧 Email send - Check your mailbox');
      });
  }
}
