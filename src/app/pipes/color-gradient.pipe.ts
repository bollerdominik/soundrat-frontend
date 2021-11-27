import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Pipe({
  name: 'colorGradient',
})
export class ColorGradientPipe implements PipeTransform {


  constructor(private sanitizer: DomSanitizer) {
  }

  transform(color: number[]): SafeStyle {
    if (!color) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(${color[0]},${color[1]},${color[2]},0.25) 100%)`);
  }
}
