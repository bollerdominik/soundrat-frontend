import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Upload} from '../upload-page.component';
import {CreateTrackRequest} from '../../../../api';
import {TrackApiService} from '../../../../services/api/track-api.service';
import {FileUploadService} from '../../../../services/api/file-upload.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileTypeCheckService} from '../../../../services/file-type-check.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileUrlPipe} from '../../../../pipes/file-url.pipe';

@Component({
  selector: 'app-track-upload',
  templateUrl: './track-upload.component.html',
  styleUrls: ['./track-upload.component.scss']
})
export class TrackUploadComponent implements OnChanges, OnInit {

  constructor(private trackApiService: TrackApiService,
              private snackBar: MatSnackBar,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private fileUrlPipe: FileUrlPipe,
              private fileTypeCheckService: FileTypeCheckService,
              private fileUploadService: FileUploadService) {
  }

  @Input()
  upload: Upload;

  trackRoute: string;

  public createTrackRequest: CreateTrackRequest;
  public image: string | ArrayBuffer;

  private editTrackId: number;

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required])
  });

  private static getLyrics(lyrics: string): string {
    if (lyrics) {
      return lyrics.replace(/<br\/>/g, '\n');
    }
    return '';
  }

  ngOnInit(): void {
    if (!this.upload) {
      this.trackApiService.getTrack(this.activeRoute.snapshot.paramMap.get('userRoute'),
        this.activeRoute.snapshot.paramMap.get('trackRoute'))
        .subscribe(value => {
          this.createTrackRequest = {
            title: value.title,
            description: '',
            coverId: null,
            lyrics: TrackUploadComponent.getLyrics(value.lyrics),
            privacy: value.privacy,
            uploadId: ''
          };
          this.editTrackId = value.id;
          this.image = this.fileUrlPipe.transform(value.coverFile);
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.upload) {
      const title = this.fileTypeCheckService.getTrackTitle(this.upload.id3?.title, this.upload.filename);
      this.createTrackRequest = {
        coverId: 0,
        description: '',
        lyrics: '',
        title,
        uploadId: this.upload.id,
        privacy: 'PUBLIC'
      };
    }
  }

  submitTrack() {
    if (!this.image) {
      this.snackBar.open('🚨 Please add a cover image to your song', null, {duration: 5000});
      return;
    }

    if (this.upload && this.upload.progress < 100) {
      this.snackBar.open('🚨 Please wait until the song is processed before saving', null, {duration: 5000});
      return;
    }

    if (!this.createTrackRequest.title) {
      return;
    }

    if (this.upload) {
      this.trackApiService.createTrack(this.createTrackRequest)
        .subscribe((value) => {
          this.upload.isSaved = true;
          this.trackRoute = value.trackRoute;
        });
    } else {
      this.trackApiService.updateTrack(this.editTrackId, {
        lyrics: this.createTrackRequest.lyrics,
        privacy: this.createTrackRequest.privacy,
        title: this.createTrackRequest.title,
        coverId: this.createTrackRequest.coverId
      })
        .subscribe(value =>
          this.router.navigate([this.activeRoute.snapshot.paramMap.get('userRoute'), value.trackRoute]));
    }
  }

  imageInput($event: Event) {
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
      .subscribe(coverId => this.createTrackRequest.coverId = coverId,
        () => {
          this.snackBar.open('🚨 Error: Please choose a different image', null, {duration: 5000});
          this.image = null;
        });
  }

  onNewSongClicked() {
    window.open('https://soundrat.com/' + this.trackRoute, '_blank');
  }

  onDeleteTrack() {
    if (confirm('Are you sure you want to delete this song? You can not undo this change.')) {
      this.trackApiService.deleteTrack(this.editTrackId)
        .subscribe(() =>  this.router.navigate([this.activeRoute.snapshot.paramMap.get('userRoute')]));
    }
  }
}
