import {Injectable} from '@angular/core';
import {FileUrlPipe} from '../pipes/file-url.pipe';
import Hls from 'hls.js';

@Injectable({
  providedIn: 'root'
})
export class FileLoadService {

  private cache: string[] = [];

  constructor(
    private fileUrlPipe: FileUrlPipe) {
  }

  prefetchAudio(playlist: string) {
    if (!this.cache.includes(playlist)) {
      this.cache.push(playlist);
      if (Hls.isSupported()) {
        const hls = new Hls({});
        hls.loadSource(this.fileUrlPipe.transform(playlist));
        const audioElement = window.document.createElement('audio');
        // @ts-ignore
        hls.attachMedia(audioElement);
      } else {
        const audioElement = window.document.createElement('audio');
        audioElement.src = this.fileUrlPipe.transform(playlist);
      }
    }
  }
}
