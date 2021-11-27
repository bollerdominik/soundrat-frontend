import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CreateSubscriptionRequest, CreateSubscriptionResponse, SubscriptionResponse} from '../../api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  createSubscription(subscription: CreateSubscriptionRequest): Observable<CreateSubscriptionResponse> {
    return this.http.post<CreateSubscriptionResponse>(this.URL + '/subscriptions', subscription);
  }

  getSubscriptions(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(this.URL + '/subscriptions');
  }

  cancel(id: number) {
    return this.http.delete<SubscriptionResponse[]>(this.URL + '/subscriptions/' + id);
  }

  getPaymentStatus(sessionId: string): Observable<any> {
    return this.http.get<any>(this.URL + '/subscriptions/payments/' + sessionId);
  }
}
