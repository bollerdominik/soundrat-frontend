import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WaveApiService {

  URL = environment.filesUrl;

  constructor(private http: HttpClient) {
  }

  getSoundWave(trackUrl: string): Observable<number[]> {
    return this.http.get<any>(this.URL + trackUrl.replace('playlist.m3u8', 'wave.json'));
  }
}
