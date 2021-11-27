import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CreateTrackRequest, DownloadResponse, TrackResponse, UpdateTrackRequest, UpdateTrackResponse} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  getTrack(userRoute: string, trackRoute: string): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(this.URL + '/tracks/' + userRoute + '/' + trackRoute);
  }

  getAllTrack(userRoute: string): Observable<TrackResponse[]> {
    return this.http.get<TrackResponse[]>(this.URL + '/tracks/' + userRoute);
  }

  createTrack(createTrackRequest: CreateTrackRequest): Observable<UpdateTrackResponse> {
    return this.http.post<UpdateTrackResponse>(this.URL + '/tracks', createTrackRequest);
  }

  downloadTrack(trackId: number): Observable<DownloadResponse> {
    return this.http.get<DownloadResponse>(this.URL + '/tracks/' + trackId + '/download');
  }

  updateTrack(trackId: number, updateTrackRequest: UpdateTrackRequest): Observable<UpdateTrackResponse> {
    return this.http.put<UpdateTrackResponse>(this.URL + '/tracks/' + trackId, updateTrackRequest);
  }

  deleteTrack(trackId: number): Observable<void> {
    return this.http.delete<void>(this.URL + '/tracks/' + trackId);
  }
}
