import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UserApiService} from '../../../services/api/user-api.service';
import {CreateUserRequest} from '../../../api';
import {switchMap, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

// @ts-ignore
export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('password').value === formGroup.get('confirmPassword').value) {
    return null;
  } else {
    return {passwordMismatch: true};
  }
};

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  formGroup = new FormGroup({
    name: new FormControl('', []), //will be marked as required in second step
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, passwordMatchValidator);

  public from: string;
  public support: string;
  showSecondForm: boolean = false;

  constructor(private userApiService: UserApiService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.from = this.activatedRoute.snapshot.queryParamMap.get('from');
    this.support = this.activatedRoute.snapshot.queryParamMap.get('support');
  }

  getEmailError() {
    return this.formGroup.get('email').hasError('required') ? 'You must enter a value' :
      this.formGroup.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  register() {
    if (this.formGroup.invalid) {
      return;
    }

    if (!this.showSecondForm) {
      this.showSecondForm = true;
      this.formGroup.get('name').setValidators([Validators.required]);
      return;
    }

    const createUserRequest: CreateUserRequest = {
      email: this.formGroup.get('email').value,
      name: this.formGroup.get('name').value,
      password: this.formGroup.get('password').value
    };

    this.userApiService.createUser(createUserRequest).pipe(
      tap(() => this.snackBar.open(
        'Account created. Welcome ' + createUserRequest.name, '🎧', {duration: 2000})),
      switchMap(() => this.authService.loginAndStore(
        {
          email: createUserRequest.email,
          password: createUserRequest.password
        })
      )
    ).subscribe((currentUser) => this.router.navigate([currentUser.userRoute]),
      () => this.snackBar.open(
        '🚨 Error: An account with this email already exists', null, {duration: 4000}));
  }
}
