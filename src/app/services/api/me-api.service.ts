import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateLikeRequest, PostResponse, UpdateUserRequest, UpdateUserResponse, UserResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeApiService {

  URL = environment.backendUrl + '/me';

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.URL);
  }

  editUser(updateUserRequest: UpdateUserRequest): Observable<UpdateUserResponse> {
    return this.http.put<UpdateUserResponse>(this.URL, updateUserRequest);
  }

  getLikes(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.URL + '/likes');
  }

  addLike(createLikeRequest: CreateLikeRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/likes', createLikeRequest);
  }

  removeLike(createLikeRequest: CreateLikeRequest) {
    // @ts-ignore
    return this.http.delete<void>(this.URL + '/likes', {params: createLikeRequest});
  }

  getFollowings(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.URL + '/followings');
  }

  addFollowings(user: UserResponse): Observable<void> {
    return this.http.post<void>(this.URL + '/followings/' + user.id, null);
  }

  deleteFollowings(user: UserResponse): Observable<void> {
    return this.http.delete<void>(this.URL + '/followings/' + user.id);
  }
}
