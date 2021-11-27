import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateMessageRequest, MessageResponse, SupporterResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  getSupporters(): Observable<SupporterResponse[]> {
    return this.http.get<SupporterResponse[]>(this.URL + '/dashboard/supporters');
  }

  getMessages(subscriptionId: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(this.URL + '/dashboard/supporters/messages/' + subscriptionId);
  }

  createMessage(subscriptionId: number, createMessage: CreateMessageRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/dashboard/supporters/messages/' + subscriptionId, createMessage);
  }
}
