import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateUserRequest, PostResponse, UserResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  URL = environment.backendUrl + '/users';

  constructor(private http: HttpClient) {
  }

  createUser(createUserRequest: CreateUserRequest): Observable<void> {
    return this.http.post<void>(this.URL, createUserRequest);
  }

  getUserPosts(userRoute: string): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.URL + '/' + userRoute + '/posts');
  }

  getUserSupporters(userRoute: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.URL + '/' + userRoute + '/supporters');
  }

  getUser(userRoute: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.URL + '/' + userRoute);
  }
}
