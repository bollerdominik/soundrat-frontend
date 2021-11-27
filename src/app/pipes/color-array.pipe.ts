import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'colorArray',
})
export class ColorArrayPipe implements PipeTransform {
  transform(color: number[]): string {
    return 'rgb(' + color.join(',') + ',0.2)'
  }
}
