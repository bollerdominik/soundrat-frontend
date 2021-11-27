import {Component, HostListener, OnInit} from '@angular/core';
import {TrackApiService} from '../../../../services/api/track-api.service';
import {CreateCollectionRequest, CreateCollectionTrack, TrackCollectionResponse, TrackResponse, UserResponse} from '../../../../api';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {FileUploadService} from '../../../../services/api/file-upload.service';
import {filter, map, switchMap, takeWhile, tap} from 'rxjs/operators';
import * as id3 from 'id3js';
import {EMPTY, Observable} from 'rxjs';
import {CollectionApiService} from '../../../../services/api/collection-api.service';
import {AuthService} from '../../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FileTypeCheckService} from '../../../../services/file-type-check.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileUrlPipe} from '../../../../pipes/file-url.pipe';

@Component({
  selector: 'app-album-upload',
  templateUrl: './album-upload.component.html',
  styleUrls: ['./album-upload.component.scss']
})
export class AlbumUploadComponent implements OnInit {

  public image: string | ArrayBuffer;

  existingTracks: TrackResponse[] = [];
  albumTracks: CreateCollectionTrack[] = [];
  createCollectionRequest: CreateCollectionRequest = {
    coverId: null,
    description: '',
    privacy: 'PUBLIC',
    title: '',
    trackList: null
  };

  collectionIdToEdit: number;
  private user: UserResponse;
  private saved = false;

  constructor(private trackApiService: TrackApiService,
              private collectionApiService: CollectionApiService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private fileTypeCheckService: FileTypeCheckService,
              private fileUrlPipe: FileUrlPipe,
              private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      filter(user => user != null),
      tap(x => this.user = x),
      switchMap(user => this.trackApiService.getAllTrack(user.userRoute)),
      tap(tracks => this.existingTracks = tracks),
      switchMap(() => this.getAlbumToEditOrEmpty())
    ).subscribe((trackCollectionResponse) =>
      this.fillFromAlbumToEdit(trackCollectionResponse)
    );
  }

  private getAlbumToEditOrEmpty(): Observable<any> {
    if (this.activeRoute.snapshot.paramMap.get('setRoute') != null) {
      return this.collectionApiService.getCollection(
        this.activeRoute.snapshot.paramMap.get('userRoute'),
        this.activeRoute.snapshot.paramMap.get('setRoute'));
    } else {
      return EMPTY;
    }
  }

  private fillFromAlbumToEdit(trackCollectionResponse: TrackCollectionResponse) {
    this.collectionIdToEdit = trackCollectionResponse.id;
    this.createCollectionRequest.title = trackCollectionResponse.title;
    this.createCollectionRequest.privacy = trackCollectionResponse.privacy;
    trackCollectionResponse.tracks.forEach(value => this.albumTracks.push(
      {
        position: this.albumTracks.length + 1,
        selectedTrack: {
          trackId: value.id
        },
        newTrack: null
      }
    ));
    this.image = this.fileUrlPipe.transform(trackCollectionResponse.coverFile);
  }

  imageInput($event: Event) {
    // FIXME duplicated code from track upload
    const file = ($event.target as HTMLInputElement).files[0];

    if (!this.fileTypeCheckService.validImage(file)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.image = reader.result;
    };

    this.fileUploadService.uploadCover(file)
      .subscribe(coverId => this.createCollectionRequest.coverId = coverId, () => {
        this.snackBar.open('🚨 Error: Please choose a different image', null, {duration: 5000});
        this.image = null;
      });
  }

  onTrackSelected(event: MatAutocompleteSelectedEvent, inputElement: HTMLInputElement) {
    inputElement.value = null;
    inputElement.blur();
    this.albumTracks.push({
      selectedTrack: {
        trackId: Number(event.option.id)
      },
      newTrack: null,
      position: this.albumTracks.length + 1
    });
  }

  getTrack(id: number): TrackResponse {
    return this.existingTracks.find(value => value.id === id);
  }

  changeTrack(event: MatAutocompleteSelectedEvent, position: number) {
    for (const albumTrack of this.albumTracks) {
      if (albumTrack.position === position) {
        if (albumTrack.selectedTrack) {
          albumTrack.selectedTrack.trackId = Number(event.option.id);
        }
      }
    }
  }

  onSaveClicked() {
    if (this.albumTracks.length === 0) {
      this.snackBar.open('🚨 Please add songs to your album', null, {duration: 5000});
      return;
    }

    if (this.hasUnprocessedTracks()) {
      this.snackBar.open('🚨 Please wait until all songs are processed before saving', null, {duration: 5000});
      return;
    }

    let observable;
    if (this.collectionIdToEdit) {
      observable = this.collectionApiService.updateCollection({
        title: this.createCollectionRequest.title,
        description: this.createCollectionRequest.description,
        privacy: this.createCollectionRequest.privacy,
        trackList: this.albumTracks,
        coverId: this.createCollectionRequest.coverId
      }, this.collectionIdToEdit);

    } else {
      if (this.createCollectionRequest.coverId == null) {
        this.snackBar.open('🚨 Please add a cover image to your album', null, {duration: 5000});
        return;
      }
      this.createCollectionRequest.trackList = this.albumTracks;
      observable = this.collectionApiService.createCollection(this.createCollectionRequest);
    }

    if (observable) {
      observable.subscribe((value) => {
        this.saved = true;
        this.router.navigate([this.user.userRoute, 'sets', value.collectionRoute]);
      });
    }
  }

  hasUnprocessedTracks() {
    return this.albumTracks.findIndex(value => value?.newTrack?.progress < 100) !== -1;
  }

  removeTrack(position: number, selected: HTMLInputElement) {
    selected.value = null;
    selected.blur();
    const newAlbumTracks: CreateCollectionTrack[] = [];
    let startIndex = 1;
    for (const albumTrack of this.albumTracks) {
      if (albumTrack.position !== position) {
        albumTrack.position = startIndex++;
        newAlbumTracks.push(albumTrack);
      }
    }
    this.albumTracks = newAlbumTracks;
  }

  getFilteredTracks(value: string): TrackResponse[] {
    const filterValue = value.toLowerCase();
    return this.existingTracks.filter(state => state.title.toLowerCase().indexOf(filterValue) === 0);
  }

  onElementDropped(event: CdkDragDrop<any>) {
    const previous = this.albumTracks.find(value => value.position === event.previousIndex + 1);
    for (const albumTrack of this.albumTracks) {
      if (albumTrack.position === event.currentIndex + 1) {
        const temp = JSON.parse(JSON.stringify(albumTrack));
        this.copy(previous, albumTrack);
        this.copy(temp, previous);
      }
    }
  }

  private copy(source: CreateCollectionTrack, target: CreateCollectionTrack) {
    if (source.newTrack) {
      target.newTrack = JSON.parse(JSON.stringify(source.newTrack));
    } else {
      target.newTrack = null;
    }
    if (source.selectedTrack) {
      target.selectedTrack = JSON.parse(JSON.stringify(source.selectedTrack));
    } else {
      target.selectedTrack = null;
    }
  }

  uploadTrack(file: File) {
    const newTrack: CreateCollectionTrack = {
      position: null,
      newTrack: {
        title: '', uploadId: '', progress: 0
      },
      selectedTrack: null
    };

    id3.fromFile(file)
      .then(id3Data =>
        newTrack.newTrack.title = this.fileTypeCheckService.getTrackTitle(id3Data?.title, file.name));

    this.fileUploadService.initiate()
      .pipe(
        map(value => value.uploadId),
        tap(uploadId => {
          newTrack.newTrack.uploadId = uploadId;
          this.albumTracks.push({
            newTrack: newTrack.newTrack,
            selectedTrack: null,
            position: this.albumTracks.length + 1,
          });
        }),
        switchMap((uploadId) => this.fileUploadService.uploadTrack(file, uploadId)),
        switchMap(() => this.fileUploadService.pollProgress(newTrack.newTrack.uploadId)),
        takeWhile(progress => progress < 100, true)
      ).subscribe(progress => newTrack.newTrack.progress = progress);
  }

  onTrackInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    Array.from(files).forEach(file => {
      this.uploadTrack(file);
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.albumTracks.length === 0 || this.saved;
  }

  changeNewTrackTitle(event: HTMLInputElement, albumTrack: CreateCollectionTrack) {
    albumTrack.newTrack.title = event.value;
  }

  onDragHandleClicked() {
    if (this.hasUnprocessedTracks()) {
      this.snackBar.open('🚨 Please wait until songs are processed to arrange your album', null, {duration: 5000});
    }
  }

  public onDeleteAlbum(): void {
    if (confirm('Are you sure you want to delete this Album? You can not undo this change.')) {
      this.collectionApiService.deleteCollection(this.collectionIdToEdit)
        .subscribe(() => this.router.navigate([this.user.userRoute]));
    }
  }
}
