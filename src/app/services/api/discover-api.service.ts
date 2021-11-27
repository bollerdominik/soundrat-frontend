import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PostResponse, UserResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscoverApiService {

  URL = environment.backendUrl + '/discover';

  constructor(private http: HttpClient) {
  }

  getPosts(page: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(environment.backendUrl + '/streams/discover?page=' + page);
  }

  getTrendingUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.URL + '/trending');
  }

}
