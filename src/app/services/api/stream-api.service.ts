import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PostResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamApiService {

  URL = environment.backendUrl + '/streams';

  constructor(private http: HttpClient) {
  }

  getFollowings(page: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.URL + '/personal?page=' + page);
  }

  getLikes(page: number) {
    return this.http.get<PostResponse[]>(this.URL + '/likes?page=' + page);
  }
}
