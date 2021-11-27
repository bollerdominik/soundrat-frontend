import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileTypeCheckService {

  constructor() {
  }

  validImage(file: File): boolean {
    const mimeType = file.type;
    return mimeType.match(/image\/*/) != null;
  }

  getTrackTitle(id3Title: string, filename: string): string {
    if (id3Title) {
      return id3Title;
    } else {
      return filename.substr(0, filename.lastIndexOf('.')).replace(/-/g, ' ');
    }
  }

}
