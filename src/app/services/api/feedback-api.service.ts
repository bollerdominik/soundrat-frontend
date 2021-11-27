import {Injectable} from '@angular/core';
import {CreateFeedbackRequest} from '../../api';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackApiService {

  public URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  create(feedbackRequest: CreateFeedbackRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/feedback', feedbackRequest);
  }
}
