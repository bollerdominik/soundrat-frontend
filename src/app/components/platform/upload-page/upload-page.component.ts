import {Component, HostListener, OnInit} from '@angular/core';
import {FileUploadService} from '../../../services/api/file-upload.service';
import {map, mergeMap, switchMap, takeWhile, tap} from 'rxjs/operators';
import {HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as id3 from 'id3js';

export class Upload {
  id: string;
  filename: string;
  id3: {
    title: string,
    album: string,
  };
  uploadProgress = 0;
  progress = 0;
  isSaved: boolean;
}

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent implements OnInit {

  public uploads: Upload[] = [];

  constructor(private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
  }

  handleFileInput(event: any) {
    const files = (event.target as HTMLInputElement).files;
    Array.from(files).forEach(file => {
      this.uploadTrack(file);
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return this.uploads.every(value => value.isSaved);
  }

  uploadTrack(track: File) {
    const upload = new Upload();
    upload.filename = track.name;

    id3.fromFile(track)
      .then(value => upload.id3 = value);

    this.fileUploadService.initiate()
      .pipe(
        map(value => value.uploadId),
        tap(uploadId => {
          upload.id = uploadId;
          this.uploads.push(upload);
        }),
        mergeMap(() => this.uploadFile(track, upload)),
        switchMap(() => this.fileUploadService.pollProgress(upload.id)),
        takeWhile(progress => progress < 100, true)
      ).subscribe(progress => upload.progress = progress);
  }

  private uploadFile(track: File, upload: Upload): Observable<void> {
    return this.fileUploadService.uploadTrack(track, upload.id).pipe(tap(data => {
      // @ts-ignore
      if (data.type === HttpEventType.UploadProgress) {
        // @ts-ignore
        upload.uploadProgress = Math.round(100 * data.loaded / data.total);
      }
    }));
  }
}
