import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ContextTypeRequest, TrackResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistApiService {

  public URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  get(contextType: ContextTypeRequest, userRoute: string, collectionRoute: string): Observable<TrackResponse[]> {
    return this.http.get<TrackResponse[]>(this.URL + '/playlist', {params: {contextType, userRoute, collectionRoute}});
  }
}
