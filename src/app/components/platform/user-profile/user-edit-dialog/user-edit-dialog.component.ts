import {Component, Inject, OnInit} from '@angular/core';
import {SocialMediaResponse, UserResponse} from '../../../../api';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {switchMap} from 'rxjs/operators';
import {FileUploadService} from '../../../../services/api/file-upload.service';
import {Observable, of} from 'rxjs';
import {FileTypeCheckService} from '../../../../services/file-type-check.service';
import {MeApiService} from '../../../../services/api/me-api.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {

  socialMediaLinks: SocialMediaResponse[];
  user: UserResponse;
  uploadingImage: boolean;
  socialMediaError = false;
  image: File;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<UserEditDialogComponent>,
              private meApiService: MeApiService,
              private fileTypeCheckService: FileTypeCheckService,
              private fileUploadService: FileUploadService) {
    this.socialMediaLinks = data.socialMedia.length > 0 ? data.socialMedia : [{website: 'INSTAGRAM', url: ''}];
    this.user = data.user;
  }

  ngOnInit(): void {
  }

  onAddSocialMediaClicked() {
    if (this.socialMediaLinks.length > 4) {
      return;
    }
    this.socialMediaLinks.push({url: '', website: 'INSTAGRAM'});
  }

  onRemoveSocialMediaClicked(socialMedia: SocialMediaResponse) {
    this.socialMediaLinks.splice(this.socialMediaLinks.indexOf(socialMedia), 1);
  }

  onSaveClicked() {
    if (this.socialMediaError) {
      return;
    }

    for (const socialMediaLink of this.socialMediaLinks) {
      if (socialMediaLink.url.length > 4) {
        if (!(socialMediaLink.url.includes('http://') || socialMediaLink.url.includes('https://'))) {
          socialMediaLink.url = 'https://' + socialMediaLink.url;
        }
      }
    }

    this.uploadImage()
      .pipe(switchMap(() => this.meApiService.editUser({
          name: this.user.name,
          description: this.user.description,
          socialMedia: this.socialMediaLinks
        })
      )).subscribe(updateUserResponse => this.dialogRef.close(updateUserResponse.userRoute));
  }

  private uploadImage(): Observable<any> {
    if (this.image) {
      this.uploadingImage = true;
      return this.fileUploadService.uploadAvatar(this.image);
    } else {
      // FIXME is that the correct way to return nothing?
      return of(null);
    }
  }

  setImage($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];

    if (this.fileTypeCheckService.validImage(file)) {
      this.image = file;
    }
  }

  onSocialMediaChanged(socialMedia: SocialMediaResponse) {
    this.socialMediaError = !socialMedia.url.toUpperCase().includes(socialMedia.website) ||
      !socialMedia.url.includes('.com');
  }
}
