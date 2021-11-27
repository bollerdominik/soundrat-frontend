import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {JwtAuthenticationResponse, LoginRequest, UserResponse} from '../api';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {UserApiService} from './api/user-api.service';
import {AnalyticsService} from './analytics.service';
import {environment} from '../../environments/environment';
import {MeApiService} from './api/me-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private helper = new JwtHelperService();
  private URL = environment.backendUrl;
  private currentUser = new BehaviorSubject<UserResponse>(null);

  currentUser$: Observable<UserResponse> = this.currentUser.asObservable();

  constructor(private http: HttpClient,
              private userApiService: UserApiService,
              private meApiService: MeApiService,
              private analyticsService: AnalyticsService) {
  }

  loadCurrentUser() {
    if (this.isAuthenticated()) {
      this.meApiService
        .getCurrentUser().subscribe(currentUser => this.setCurrentUser(currentUser),
        () => localStorage.removeItem(this.TOKEN_KEY));
    }
  }

  private getDecodeToken() {
    return this.helper.decodeToken(this.getToken());
  }

  public getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private login(loginRequest: LoginRequest): Observable<JwtAuthenticationResponse> {
    return this.http.post<JwtAuthenticationResponse>(this.URL + '/login', loginRequest);
  }

  loginAndStore(loginRequest: LoginRequest): Observable<UserResponse> {
    return this.login(loginRequest).pipe(
      map(value => value.accessToken),
      tap(accessToken => this.storeToken(accessToken)),
      switchMap(() => this.meApiService.getCurrentUser()),
      tap(currentUser => this.setCurrentUser(currentUser))
    );
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.helper.isTokenExpired(token);
  }

  private storeToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setCurrentUser(currentUser: UserResponse) {
    this.analyticsService.setUser(this.getDecodeToken().sub);
    this.currentUser.next(currentUser);
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
