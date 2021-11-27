import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SocialMediaResponse} from '../../api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaApiService {

  public URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  getSocialMediaLinks(userId: number): Observable<SocialMediaResponse[]> {
    return this.http.get<SocialMediaResponse[]>(this.URL + '/social-media/' + userId);
  }
}
