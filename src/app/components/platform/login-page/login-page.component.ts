import {Component, OnInit} from '@angular/core';
import {LoginRequest} from '../../../api';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  public from: string;

  getEmailError() {
    return this.formGroup.get('email').hasError('required') ? 'You must enter a value' :
      this.formGroup.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.from = this.activatedRoute.snapshot.queryParamMap.get('from');
  }

  login() {
    const loginRequest: LoginRequest = {
      email: this.formGroup.get('email').value,
      password: this.formGroup.get('password').value,
    };

    this.authService.loginAndStore(loginRequest)
      .subscribe((currentUser) => {
        this.snackBar.open('Welcome back ' + currentUser.name, '🎧', {duration: 2000});
        if (this.from) {
          this.router.navigate([this.from]);
        } else {
          this.router.navigate([currentUser.userRoute]);
        }
      }, error => this.snackBar.open(error.error.message, null, {duration: 2000}));
  }

}
