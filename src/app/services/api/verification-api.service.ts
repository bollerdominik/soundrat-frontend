import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  CreateStripeOauthRequest,
  CreateSubscriptionResponse,
  CreateVerificationRequest,
  DashboardResponse,
  VerificationResponse
} from '../../api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  addStripeCode(createStripeOauthRequest: CreateStripeOauthRequest): Observable<CreateSubscriptionResponse> {
    return this.http.post<CreateSubscriptionResponse>(this.URL + '/verifications/code', createStripeOauthRequest);
  }

  getVerification(): Observable<VerificationResponse> {
    return this.http.get<VerificationResponse>(this.URL + '/verifications');
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.URL + '/verifications/dashboard');
  }

  createVerification(createVerificationRequest: CreateVerificationRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/verifications', createVerificationRequest);
  }

  editVerification(createVerificationRequest: CreateVerificationRequest): Observable<void> {
    return this.http.put<void>(this.URL + '/verifications', createVerificationRequest);
  }
}
