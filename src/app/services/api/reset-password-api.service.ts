import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  requestReset(email: string): Observable<void> {
    return this.http.post<void>(this.URL + '/login/requestReset', null, {params: {email}});
  }

  resetPassword(password: string, key: string): Observable<void> {
    return this.http.post<void>(this.URL + '/login/reset', null, {params: {password, key}});
  }
}
