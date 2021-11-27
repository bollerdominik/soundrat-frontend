import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CreateCollectionRequest,
  TrackCollectionResponse,
  UpdateCollectionRequest,
  UpdateCollectionResponse
} from '../../api';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionApiService {

  URL = environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  getCollection(userRoute: string, setRoute: string): Observable<TrackCollectionResponse> {
    return this.http.get<TrackCollectionResponse>(this.URL + '/sets/' + userRoute + '/' + setRoute);
  }

  createCollection(createCollectionRequest: CreateCollectionRequest): Observable<UpdateCollectionResponse> {
    return this.http.post<UpdateCollectionResponse>(this.URL + '/sets', createCollectionRequest);
  }

  updateCollection(updateCollectionRequest: UpdateCollectionRequest, collectionId: number): Observable<UpdateCollectionResponse> {
    return this.http.put<UpdateCollectionResponse>(this.URL + '/sets/' + collectionId, updateCollectionRequest);
  }

  deleteCollection(collectionId: number): Observable<void> {
    return this.http.delete<void>(this.URL + '/sets/' + collectionId);
  }
}
