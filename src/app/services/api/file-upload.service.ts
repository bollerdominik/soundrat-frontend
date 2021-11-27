import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {interval, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  uploadTrack(track: File, uploadId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', track);
    formData.append('uploadId', uploadId);
    return this.http.post<void>(this.URL + '/upload/tracks', formData,
      {reportProgress: true, observe: 'events'});
  }

  pollProgress(uploadId: string): Observable<number> {
    return interval(1000).pipe(
      switchMap(() => this.progress(uploadId)
        .pipe(map(value => value.progress))
      )
    );
  }

  uploadCover(cover: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', cover);
    return this.http.post<number>(this.URL + '/upload/covers', formData);
  }

  initiate(): Observable<{ uploadId: string }> {
    return this.http.get<{ uploadId: string }>(this.URL + '/upload/init');
  }

  private progress(uploadId: string): Observable<{ progress: number }> {
    return this.http.get<{ progress: number }>(this.URL + '/upload/status/' + uploadId);
  }

  uploadAvatar(avatar: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', avatar);
    return this.http.put<void>(this.URL + '/upload/avatars', formData);
  }
}
