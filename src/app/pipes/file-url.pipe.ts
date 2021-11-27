import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../environments/environment';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {

  private FILE_BASE_URL = environment.filesUrl;

  transform(value: string): any {
    return this.FILE_BASE_URL + value;
  }
}
