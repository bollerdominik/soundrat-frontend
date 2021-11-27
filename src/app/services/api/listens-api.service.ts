import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateListenRequest, CreateMessageRequest, MessageResponse, SupporterResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListensApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  addListen(createListen: CreateListenRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/listens', createListen);
  }
}
