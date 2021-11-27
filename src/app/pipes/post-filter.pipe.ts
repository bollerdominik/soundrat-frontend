import { Pipe, PipeTransform } from '@angular/core';
import {PostResponse} from "../api";

@Pipe({
  name: 'postFilter'
})
export class PostFilterPipe implements PipeTransform {

  transform(value: PostResponse[], ...args: string[]): PostResponse[] {
    return value.filter(post => {
      if (args[0] === 'trackCollection') {
        return post.trackCollection != null;
      }
      if (args[0] === 'track') {
        return post.track != null;
      }
      return true;
    })
  }

}
