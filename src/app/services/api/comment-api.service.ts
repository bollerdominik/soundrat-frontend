import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommentResponse, CreateCommentRequest} from '../../api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentApiService {

  public URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  getCommentsForTrack(trackId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(this.URL + '/comments/tracks/' + trackId);
  }

  getCommentsForCollection(collectionId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(this.URL + '/comments/sets/' + collectionId);
  }

  createCommentForTrack(trackId: number, createCommentRequest: CreateCommentRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/comments/tracks/' + trackId, createCommentRequest);
  }

  createCommentForCollection(collectionId: number, createCommentRequest: CreateCommentRequest): Observable<void> {
    return this.http.post<void>(this.URL + '/comments/sets/' + collectionId, createCommentRequest);
  }
}
